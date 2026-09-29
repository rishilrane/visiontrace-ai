import os
import time
import uuid
import cv2
import numpy as np
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import Optional

from services.file_service import FileService, PROCESSED_DIR, UPLOAD_DIR
from services.face_detector import FaceDetectionService
from services.image_analysis import ImageForensicAnalyzer
from services.video_analysis import VideoForensicAnalyzer
from services.explanation_service import ExplanationService
from services.report_service import ReportService
from detectors.engine import DetectionEngine
import database

router = APIRouter(prefix="/api", tags=["Analysis"])

face_service = FaceDetectionService()
video_analyzer = VideoForensicAnalyzer(face_service)
engine = DetectionEngine()

@router.post("/analyze")
async def analyze_media(
    file: UploadFile = File(...)
):
    """
    Main analysis endpoint executing the 8-step detection pipeline:
    1. File Validation
    2. Pre-processing
    3. Face Detection
    4. Feature Extraction
    5. AI/ML Detection
    6. Confidence Calculation
    7. Explanation Generation
    8. Report Preparation & DB Storage
    """
    start_time = time.time()
    
    # STEP 1: File Validation & Secure Storage
    try:
        saved_path, original_filename, file_size, file_type = await FileService.save_uploaded_file(file)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process uploaded file: {str(e)}")

    analysis_id = f"VT-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    try:
        if file_type == "image":
            # STEP 2: Pre-processing
            img_bgr = cv2.imread(saved_path)
            if img_bgr is None:
                raise HTTPException(status_code=400, detail="Corrupted image file: Unable to decode image.")
                
            # Resize if excessively large to maintain responsiveness while preserving aspect ratio
            h, w = img_bgr.shape[:2]
            max_dim = 1600
            if max(h, w) > max_dim:
                scale = max_dim / float(max(h, w))
                img_bgr = cv2.resize(img_bgr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
                cv2.imwrite(saved_path, img_bgr)
                h, w = img_bgr.shape[:2]

            # STEP 3: Face Detection
            face_boxes = face_service.detect_faces(img_bgr)

            # STEP 4: Feature Extraction
            features = ImageForensicAnalyzer.analyze_image_features(saved_path, img_bgr, face_boxes)

            # STEP 5 & 6: AI/ML Detection & Confidence Calculation
            preprocessed_data = {
                "faces": face_boxes,
                "features": features
            }
            detection_result = engine.analyze_image(saved_path, preprocessed_data)

            # Generate visual HUD overlay image with bounding boxes & artifact highlights
            processed_filename = f"annotated_{os.path.basename(saved_path)}"
            processed_full_path = os.path.join(PROCESSED_DIR, processed_filename)
            face_service.generate_annotated_overlay(
                img_bgr,
                face_boxes,
                features.get("suspicious_regions", []),
                processed_full_path
            )

            # STEP 7: Explanation Generation
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
                "format": os.path.splitext(original_filename)[1].upper().replace(".", ""),
                "color_channels": 3
            }
            frame_details = []
            frames_analyzed = 1

        else: # video
            # STEP 2-4: Video frame sampling, face tracking, temporal consistency
            try:
                video_res = video_analyzer.analyze_video(saved_path, PROCESSED_DIR)
            except ValueError as ve:
                raise HTTPException(status_code=400, detail=str(ve))

            # STEP 5 & 6: AI/ML Video Detection & Aggregation
            frame_details = video_res["frame_details"]
            detection_result = engine.analyze_video(saved_path, frame_details)

            processed_full_path = video_res.get("representative_keyframe_path") or ""
            face_boxes_count = video_res.get("faces_detected", 0)
            frames_analyzed = video_res["metadata_info"].get("sampled_frames_count", len(frame_details))
            metadata_info = video_res["metadata_info"]

            # STEP 7: Explanation Generation
            explanation = ExplanationService.generate_explanation(
                prediction=detection_result["prediction"],
                confidence=detection_result["confidence"],
                indicators=detection_result["indicators"],
                file_type="video",
                faces_detected=face_boxes_count
            )

        elapsed_time = round(time.time() - start_time, 2)

        # STEP 8: Report Generation & Database Storage
        # Convert absolute paths to relative web URLs
        web_file_path = f"/uploads/{os.path.basename(saved_path)}"
        web_processed_path = f"/uploads/processed/{os.path.basename(processed_full_path)}" if processed_full_path else None

        record_data = {
            "id": analysis_id,
            "filename": original_filename,
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

        # Store in SQLite database
        database.insert_analysis(record_data)

        # Generate pre-cached PDF report
        report_pdf_dir = os.path.join(os.path.dirname(UPLOAD_DIR), "reports")
        report_pdf_path = os.path.join(report_pdf_dir, f"report_{analysis_id}.pdf")
        try:
            ReportService.generate_pdf_report(record_data, report_pdf_path)
        except Exception as re:
            print(f"Warning: PDF generation deferred: {re}")

        return record_data

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Analysis pipeline encountered an error: {str(e)}"
        )
