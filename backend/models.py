from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class IndicatorModel(BaseModel):
    name: str
    status: str  # "anomaly", "normal", "info"
    severity: str  # "high", "medium", "low", "none"
    score: float
    description: str

class FrameDetailModel(BaseModel):
    frame_number: int
    timestamp: str
    confidence: float
    status: str  # "Normal", "Suspicious"
    anomaly_score: float

class AnalysisResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size: int
    file_path: str
    processed_path: Optional[str] = None
    prediction: str
    confidence: float
    risk_level: str
    detector_name: str = "AI-Assisted Baseline Detector"
    faces_detected: int
    frames_analyzed: int
    indicators: List[IndicatorModel]
    explanation: str
    metadata_info: Dict[str, Any] = Field(default_factory=dict)
    frame_details: List[FrameDetailModel] = Field(default_factory=list)
    processing_time: float
    created_at: str

class DashboardStatsResponse(BaseModel):
    total_analyses: int
    deepfakes_detected: int
    real_media: int
    avg_confidence: float
    recent_analyses: List[AnalysisResponse]

class SampleMediaItem(BaseModel):
    id: str
    title: str
    description: str
    file_type: str
    filename: str
    category: str
