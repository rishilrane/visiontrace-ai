import os
import shutil
import uuid
import cv2
import time
from datetime import datetime
from fastapi import APIRouter, HTTPException

from services.file_service import UPLOAD_DIR, PROCESSED_DIR
from services.face_detector import FaceDetectionService
from services.image_analysis import ImageForensicAnalyzer
from services.video_analysis import VideoForensicAnalyzer
from services.explanation_service import ExplanationService
from services.report_service import ReportService
from detectors.engine import DetectionEngine
import database

router = APIRouter(prefix="/api/demo", tags=["Demo"])

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "samples")
face_service = FaceDetectionService()
video_analyzer = VideoForensicAnalyzer(face_service)
engine = DetectionEngine()

DEMO_CATALOG = [
    {
        "id": "authentic_portrait",
        "title": "Authentic Portrait Capture",
        "filename": "sample_authentic_portrait.jpg",
        "file_type": "image",
        "description": "Natural photographic portrait with continuous skin gradients, uniform JPEG compression, and authentic sensor noise floor.",
        "expected": "LIKELY AUTHENTIC"
    },
    {
        "id": "manipulated_face",
        "title": "Manipulated Face (Synthetic Artifacts)",
        "filename": "sample_manipulated_face.jpg",
        "file_type": "image",
        "description": "Image with spliced facial region exhibiting artificial smoothing, high-frequency checkerboard upsampling artifacts, and boundary edge disparity.",
        "expected": "POTENTIALLY MANIPULATED"
    },
    {
        "id": "sample_video",
        "title": "Short Video Sequence (Temporal Jitter)",
        "filename": "sample_forensic_video.mp4",
        "file_type": "video",
        "description": "A 3-second 15-FPS video clip containing localized facial landmark displacement and inter-frame temporal jitter across later keyframes.",
        "expected": "POTENTIALLY MANIPULATED"
    }
]

@router.get("/samples")
def get_demo_samples():
    """
    List bundled demo media files available for instant 1-click testing.
    """
    return DEMO_CATALOG

@router.post("/analyze/{sample_id}")
def run_demo_analysis(sample_id: str):
    """
    Run the actual full 8-step forensic detection pipeline on a bundled demo sample.
    """
    sample = next((s for s in DEMO_CATALOG if s["id"] == sample_id), None)
    if not sample:
        raise HTTPException(status_code=404, detail=f"Demo sample '{sample_id}' not found.")

    src_path = os.path.join(SAMPLES_DIR, sample["filename"])
    if not os.path.exists(src_path):
        raise HTTPException(status_code=500, detail="Demo sample file is missing from server.")

    # Copy to uploads directory to treat identically as user upload
    start_time = time.time()
    unique_name = f"demo_{uuid.uuid4().hex[:8]}_{sample['filename']}"
    dest_path = os.path.join(UPLOAD_DIR, unique_name)
    shutil.copyfile(src_path, dest_path)
    file_size = os.path.getsize(dest_path)

    analysis_id = f"VT-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    file_type = sample["file_type"]

    try:
        if file_type == "image":
            img_bgr = cv2.imread(dest_path)
            if img_bgr is None:
                raise HTTPException(status_code=400, detail="Could not read sample image.")
                
            h, w = img_bgr.shape[:2]
            face_boxes = face_service.detect_faces(img_bgr)
            features = ImageForensicAnalyzer.analyze_image_features(dest_path, img_bgr, face_boxes)

            preprocessed_data = {
                "faces": face_boxes,
                "features": features
            }
            detection_result = engine.analyze_image(dest_path, preprocessed_data)

            # Generate visual HUD overlay
            processed_filename = f"annotated_{unique_name}"
            processed_full_path = os.path.join(PROCESSED_DIR, processed_filename)
            face_service.generate_annotated_overlay(
                img_bgr,
                face_boxes,
                features.get("suspicious_regions", []),
                processed_full_path
            )

            explanation = ExplanationService.generate_explanation(
                prediction=detection_result["prediction"],
                confidence=detection_result["confidence"],
                indicators=detection_result["indicators"],
                file_type="image",
                faces_detected=len(face_boxes)
            )

            metadata_info = {
                "resolution": f"{w}x{h}",
                "aspect_ratio": f"{w/h:.2f}" if h > 0 else "1.0",
                "format": "JPG",
                "color_channels": 3
            }
            frame_details = []
            frames_analyzed = 1

        else: # video
            video_res = video_analyzer.analyze_video(dest_path, PROCESSED_DIR)
            frame_details = video_res["frame_details"]
            detection_result = engine.analyze_video(dest_path, frame_details)

            processed_full_path = video_res.get("representative_keyframe_path") or ""
            face_boxes_count = video_res.get("faces_detected", 0)
            frames_analyzed = video_res["metadata_info"].get("sampled_frames_count", len(frame_details))
            metadata_info = video_res["metadata_info"]

            explanation = ExplanationService.generate_explanation(
                prediction=detection_result["prediction"],
                confidence=detection_result["confidence"],
                indicators=detection_result["indicators"],
                file_type="video",
                faces_detected=face_boxes_count
            )

        elapsed_time = round(time.time() - start_time, 2)
        web_file_path = f"/uploads/{unique_name}"
        web_processed_path = f"/uploads/processed/{os.path.basename(processed_full_path)}" if processed_full_path else None

        record_data = {
            "id": analysis_id,
            "filename": sample["filename"],
            "file_type": file_type,
            "file_size": file_size,
            "file_path": web_file_path,
            "processed_path": web_processed_path,
            "prediction": detection_result["prediction"],
            "confidence": detection_result["confidence"],
            "risk_level": detection_result["risk_level"],
            "detector_name": detection_result.get("detector_name", "AI-Assisted Baseline Detector"),
            "faces_detected": len(face_boxes) if file_type == "image" else video_res.get("faces_detected", 0),
            "frames_analyzed": frames_analyzed,
            "indicators": detection_result["indicators"],
            "explanation": explanation,
            "metadata_info": metadata_info,
            "frame_details": frame_details,
            "processing_time": elapsed_time,
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        database.insert_analysis(record_data)

        # Pre-cache PDF report
        report_pdf_dir = os.path.join(os.path.dirname(UPLOAD_DIR), "reports")
        report_pdf_path = os.path.join(report_pdf_dir, f"report_{analysis_id}.pdf")
        try:
            ReportService.generate_pdf_report(record_data, report_pdf_path)
        except Exception:
            pass

        return record_data

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Demo execution failed: {str(e)}")
