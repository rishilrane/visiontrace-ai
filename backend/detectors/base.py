from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseDetector(ABC):
    """
    Abstract Base Detector for Deepfake Detection.
    All detectors (Baseline, CNN, Transformer, Hybrid) inherit from this interface.
    """
    def __init__(self, name: str, version: str = "1.0.0"):
        self.name = name
        self.version = version

    @abstractmethod
    def detect_image(self, image_path: str, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze an image and return structured prediction results.
        """
        pass

    @abstractmethod
    def detect_video(self, video_path: str, sampled_frames_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze sampled video frames and return aggregated prediction results.
        """
        pass
