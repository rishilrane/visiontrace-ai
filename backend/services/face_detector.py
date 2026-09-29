import cv2
import os
import numpy as np
from typing import List, Tuple, Dict, Any

class FaceDetectionService:
    def __init__(self):
        # Load Haar Cascade from OpenCV built-in directory
        cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_frontalface_default.xml")
        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        eye_cascade_path = os.path.join(cv2.data.haarcascades, "haarcascade_eye.xml")
        self.eye_cascade = cv2.CascadeClassifier(eye_cascade_path)

    def detect_faces(self, image_bgr: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """
        Detect face bounding boxes (x, y, w, h) in a BGR image.
        """
        if image_bgr is None or image_bgr.size == 0:
            return []
            
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        # Apply histogram equalization for better detection under diverse lighting
        gray_eq = cv2.equalizeHist(gray)
        
        faces = self.face_cascade.detectMultiScale(
            gray_eq,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(48, 48),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        # If no faces detected with equalized, try standard grayscale
        if len(faces) == 0:
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=4,
                minSize=(40, 40)
            )
            
        return [tuple(f) for f in faces]

    def extract_face_rois(self, image_bgr: np.ndarray, boxes: List[Tuple[int, int, int, int]]) -> List[np.ndarray]:
        """
        Extract cropped face regions with safety margins.
        """
        h, w = image_bgr.shape[:2]
        rois = []
        for (x, y, fw, fh) in boxes:
            pad_x = int(fw * 0.1)
            pad_y = int(fh * 0.1)
            x1 = max(0, x - pad_x)
            y1 = max(0, y - pad_y)
            x2 = min(w, x + fw + pad_x)
            y2 = min(h, y + fh + pad_y)
            roi = image_bgr[y1:y2, x1:x2]
            rois.append(roi)
        return rois

    def generate_annotated_overlay(
        self,
        image_bgr: np.ndarray,
        boxes: List[Tuple[int, int, int, int]],
        suspicious_regions: List[Dict[str, Any]],
        output_path: str
    ) -> str:
        """
        Draw detected face boxes, suspicious forensic hotspots, and HUD markers.
        """
        annotated = image_bgr.copy()
        
        # Draw face detection boxes (Cyan / Blue forensic style)
        for i, (x, y, w, h) in enumerate(boxes):
            # Target corner brackets
            corner_len = int(min(w, h) * 0.2)
            cv2.rectangle(annotated, (x, y), (x + w, y + h), (0, 220, 255), 2)
            
            # Corner accents
            t = 3
            # Top-left
            cv2.line(annotated, (x, y), (x + corner_len, y), (0, 255, 200), t)
            cv2.line(annotated, (x, y), (x, y + corner_len), (0, 255, 200), t)
            # Top-right
            cv2.line(annotated, (x + w, y), (x + w - corner_len, y), (0, 255, 200), t)
            cv2.line(annotated, (x + w, y), (x + w, y + corner_len), (0, 255, 200), t)
            # Bottom-left
            cv2.line(annotated, (x, y + h), (x + corner_len, y + h), (0, 255, 200), t)
            cv2.line(annotated, (x, y + h), (x, y + h - corner_len), (0, 255, 200), t)
            # Bottom-right
            cv2.line(annotated, (x + w, y + h), (x + w - corner_len, y + h), (0, 255, 200), t)
            cv2.line(annotated, (x + w, y + h), (x + w, y + h - corner_len), (0, 255, 200), t)
            
            # Label
            label = f"FACE #{i+1} [FORENSIC ROI]"
            cv2.rectangle(annotated, (x, max(0, y - 24)), (x + 190, y), (15, 23, 42), -1)
            cv2.putText(annotated, label, (x + 6, max(14, y - 7)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 240, 255), 1, cv2.LINE_AA)
            
        # Draw suspicious forensic anomalies if detected
        for region in suspicious_regions:
            rx, ry, rw, rh = region.get("box", (0, 0, 0, 0))
            if rw > 0 and rh > 0:
                overlay = annotated.copy()
                # Red / Amber dashed highlight
                cv2.rectangle(overlay, (rx, ry), (rx + rw, ry + rh), (0, 70, 255), -1)
                cv2.addWeighted(overlay, 0.25, annotated, 0.75, 0, annotated)
                cv2.rectangle(annotated, (rx, ry), (rx + rw, ry + rh), (0, 100, 255), 1)
                
                desc = region.get("type", "ARTIFACT")
                cv2.putText(annotated, f"! {desc}", (rx + 4, ry + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1, cv2.LINE_AA)
                
        # Ensure output directory exists and save
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        cv2.imwrite(output_path, annotated)
        return output_path
