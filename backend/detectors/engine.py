from typing import Dict, Any, List, Optional
from detectors.base import BaseDetector
from detectors.baseline_detector import BaselineForensicDetector

class DetectionEngine:
    """
    Central Detection Engine orchestrator for VisionTrace AI.
    Provides pluggable architecture for Baseline, CNN, Transformer, and Hybrid models.
    """
    def __init__(self, default_detector: Optional[BaseDetector] = None):
        self.detector = default_detector or BaselineForensicDetector()
        self.available_detectors = {
            "baseline": self.detector,
            # Extensible: "cnn": CNNDetector(), "transformer": TransformerDetector()
        }

    def set_detector(self, detector_key: str):
        if detector_key in self.available_detectors:
            self.detector = self.available_detectors[detector_key]
        else:
            raise ValueError(f"Detector '{detector_key}' is not registered.")

    def analyze_image(self, image_path: str, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute image analysis via the active detector.
        """
        return self.detector.detect_image(image_path, preprocessed_data)

    def analyze_video(self, video_path: str, sampled_frames_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Execute video analysis via the active detector.
        """
        return self.detector.detect_video(video_path, sampled_frames_data)
