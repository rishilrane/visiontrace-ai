import cv2
import os
import numpy as np
from typing import Dict, Any, List, Tuple
from services.face_detector import FaceDetectionService
from services.image_analysis import ImageForensicAnalyzer

class VideoForensicAnalyzer:
    """
    Analyzes video media via intelligent frame sampling, inter-frame temporal consistency,
    facial tracking stability, and per-frame forensic anomaly scoring.
    """

    def __init__(self, face_service: FaceDetectionService):
        self.face_service = face_service

    def analyze_video(self, video_path: str, output_dir: str) -> Dict[str, Any]:
        """
        Extract sampled frames, measure temporal consistency, and evaluate frame-by-frame anomalies.
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Could not open video file. The format may be unsupported or corrupted.")

        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = round(total_frames / fps, 2) if fps > 0 else 0.0

        # Intelligent sampling: 12 to 24 frames
        num_samples = max(10, min(24, total_frames // int(fps) * 2 if total_frames > 25 else total_frames))
        if total_frames <= 0:
            cap.release()
            raise ValueError("Video has zero readable frames.")
            
        step = max(1, total_frames // num_samples)
        sample_indices = [min(i * step, total_frames - 1) for i in range(num_samples)]
        sample_indices = sorted(list(set(sample_indices)))

        frame_details = []
        suspicious_count = 0
        total_faces_found = 0
        all_confidences = []
        
        previous_face_box = None
        representative_keyframe_path = None
        keyframe_saved = False

        for idx in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret or frame is None:
                continue

            timestamp_sec = idx / fps
            mins = int(timestamp_sec // 60)
            secs = timestamp_sec % 60
            timestamp_str = f"{mins:02d}:{secs:04.1f}"

            # Run face detection on sampled frame
            faces = self.face_service.detect_faces(frame)
            total_faces_found += len(faces)
            
            # Sharpness & noise
            sharpness = ImageForensicAnalyzer.compute_laplacian_sharpness(frame)
            noise = ImageForensicAnalyzer.compute_noise_residual(frame)
            
            # Frame anomaly scoring (0.0 to 1.0)
            frame_anomaly_score = 0.15 # Baseline normal
            reasons = []

            if len(faces) > 0:
                current_box = faces[0]
                if previous_face_box is not None:
                    # Check bounding box jitter (unnatural displacement between adjacent sampled frames)
                    dx = abs(current_box[0] - previous_face_box[0])
                    dy = abs(current_box[1] - previous_face_box[1])
                    dw = abs(current_box[2] - previous_face_box[2])
                    jitter = (dx + dy + dw) / (width + 1e-5)
                    if jitter > 0.30:
                        frame_anomaly_score += 0.35
                        reasons.append("Face landmark temporal jitter")
                previous_face_box = current_box

                # Check face ROI sharpness disparity
                fx, fy, fw, fh = current_box
                face_roi = frame[fy:fy+fh, fx:fx+fw]
                if face_roi.size > 0:
                    face_sharp = ImageForensicAnalyzer.compute_laplacian_sharpness(face_roi)
                    ratio = face_sharp / (sharpness + 1e-5)
                    if ratio < 0.3 or ratio > 3.2:
                        frame_anomaly_score += 0.3
                        reasons.append("Facial blending sharpness disparity")

            # Check noise levels
            if noise < 2.0:
                frame_anomaly_score += 0.15
                reasons.append("Abnormally low sensor noise (synthetic smooth)")

            # Normalize anomaly score
            frame_anomaly_score = min(0.95, max(0.08, frame_anomaly_score))
            
            # Status: Suspicious if anomaly score > 0.55
            is_suspicious = frame_anomaly_score > 0.55
            if is_suspicious:
                suspicious_count += 1
                status = "Suspicious"
            else:
                status = "Normal"

            confidence = round(frame_anomaly_score * 100, 1)
            all_confidences.append(confidence)

            # Save first frame or suspicious frame as representative annotated keyframe
            if not keyframe_saved or (is_suspicious and representative_keyframe_path is None):
                keyframe_filename = f"keyframe_{os.path.basename(video_path)}.jpg"
                keyframe_full_path = os.path.join(output_dir, keyframe_filename)
                suspicious_regions = []
                if is_suspicious and len(faces) > 0:
                    suspicious_regions.append({
                        "box": faces[0],
                        "type": "TEMPORAL_INCONSISTENCY"
                    })
                self.face_service.generate_annotated_overlay(
                    frame, faces, suspicious_regions, keyframe_full_path
                )
                representative_keyframe_path = keyframe_full_path
                keyframe_saved = True

            frame_details.append({
                "frame_number": int(idx),
                "timestamp": timestamp_str,
                "confidence": confidence,
                "status": status,
                "anomaly_score": round(frame_anomaly_score, 3),
                "faces_in_frame": len(faces),
                "reasons": reasons
            })

        cap.release()

        avg_confidence = round(float(np.mean(all_confidences)), 1) if all_confidences else 50.0

        metadata_info = {
            "fps": round(fps, 2),
            "total_frames": total_frames,
            "duration_seconds": duration,
            "resolution": f"{width}x{height}",
            "sampled_frames_count": len(frame_details)
        }

        return {
            "metadata_info": metadata_info,
            "frame_details": frame_details,
            "suspicious_frames_count": suspicious_count,
            "faces_detected": total_faces_found,
            "avg_frame_confidence": avg_confidence,
            "representative_keyframe_path": representative_keyframe_path
        }
