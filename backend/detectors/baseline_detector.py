import numpy as np
from typing import Dict, Any, List
from detectors.base import BaseDetector

class BaselineForensicDetector(BaseDetector):
    """
    AI-Assisted Baseline Detector.
    Uses multi-factor forensic feature fusion:
    1. Error Level Analysis (JPEG compression differential)
    2. Laplacian Gradient & Edge Sharpness variance
    3. 2D FFT Power Spectrum high-frequency artifact ratio
    4. Sensor Noise standard deviation differential
    5. Temporal consistency across sampled video frames
    """
    def __init__(self):
        super().__init__(name="AI-Assisted Baseline Detector", version="1.2.0-baseline")

    def detect_image(self, image_path: str, preprocessed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze extracted image features and calculate dynamic manipulation probability.
        """
        features = preprocessed_data.get("features", {})
        faces = preprocessed_data.get("faces", [])
        
        ela_mean = features.get("ela_mean", 0.0)
        global_sharpness = features.get("global_sharpness", 0.0)
        global_noise = features.get("global_noise_std", 0.0)
        fft_ratio = features.get("global_fft_ratio", 0.0)
        face_features = features.get("face_features", [])
        
        indicators = []
        anomaly_weights = []
        
        # 1. Face Detection Indicator
        num_faces = len(faces)
        if num_faces > 0:
            indicators.append({
                "name": f"Facial Region Analysis ({num_faces} face{'s' if num_faces > 1 else ''} isolated)",
                "status": "normal",
                "severity": "none",
                "score": round(min(1.0, num_faces * 0.5), 2),
                "description": f"Successfully identified and isolated {num_faces} facial region(s) for region-of-interest analysis."
            })
        else:
            indicators.append({
                "name": "Facial Region Analysis",
                "status": "info",
                "severity": "low",
                "score": 0.0,
                "description": "No frontal facial landmark clusters detected; executing global forensic analysis on full frame."
            })

        # 2. Error Level Analysis (ELA) Indicator
        ela_score = min(1.0, max(0.0, (ela_mean - 2.5) / 12.0))
        if ela_mean > 5.5:
            indicators.append({
                "name": "Compression Error Inconsistency (ELA)",
                "status": "anomaly",
                "severity": "high" if ela_mean > 12.0 else "medium",
                "score": round(ela_score, 2),
                "description": f"Significant variance in JPEG error level (mean {ela_mean:.1f}), indicating localized compression anomalies or image splicing."
            })
            anomaly_weights.append(0.35 * ela_score)
        else:
            indicators.append({
                "name": "Compression Consistency (ELA)",
                "status": "normal",
                "severity": "none",
                "score": round(ela_score, 2),
                "description": f"Error Level Analysis shows uniform compression signature (mean {ela_mean:.1f}) across media surfaces."
            })

        # 3. FFT High-Frequency Spectrum Indicator
        # GAN and diffusion synthesis typically generate high frequency grid peaks (fft_ratio > 0.65)
        fft_score = min(1.0, max(0.0, (fft_ratio - 0.50) / 0.35))
        if fft_ratio > 0.68:
            indicators.append({
                "name": "Frequency Domain Spectral Artifacts (FFT)",
                "status": "anomaly",
                "severity": "medium",
                "score": round(fft_score, 2),
                "description": f"Elevated high-frequency energy ratio ({fft_ratio:.2f}) consistent with convolutional up-sampling artifacts."
            })
            anomaly_weights.append(0.25 * fft_score)
        else:
            indicators.append({
                "name": "Frequency Domain Spectrum",
                "status": "normal",
                "severity": "none",
                "score": round(fft_score, 2),
                "description": f"2D Fourier transform power spectrum is consistent with natural photographic attenuation ({fft_ratio:.2f})."
            })

        # 4. Facial Texture & Sharpness Consistency
        face_anomaly = False
        face_disparity_score = 0.0
        if face_features:
            worst_face = max(face_features, key=lambda f: abs(1.0 - f["sharpness_ratio"]))
            sharp_ratio = worst_face["sharpness_ratio"]
            edge_disp = worst_face["edge_disparity"]
            
            if sharp_ratio < 0.40 or sharp_ratio > 2.8 or edge_disp > 0.14:
                face_anomaly = True
                face_disparity_score = min(1.0, abs(1.0 - sharp_ratio) / 2.0 + edge_disp * 3.0)
                indicators.append({
                    "name": "Facial Boundary & Sharpness Discrepancy",
                    "status": "anomaly",
                    "severity": "high" if face_disparity_score > 0.7 else "medium",
                    "score": round(face_disparity_score, 2),
                    "description": f"Discrepancy detected between facial edge gradients and context background (sharpness ratio {sharp_ratio:.2f}, edge disparity {edge_disp:.2f})."
                })
                anomaly_weights.append(0.40 * face_disparity_score)
            else:
                indicators.append({
                    "name": "Facial Edge & Texture Alignment",
                    "status": "normal",
                    "severity": "none",
                    "score": round(face_disparity_score, 2),
                    "description": f"Facial gradient transitions and skin texture blur levels ({sharp_ratio:.2f}) align naturally with surrounding context."
                })

        # 5. Sensor Noise Consistency
        noise_score = min(1.0, max(0.0, (12.0 - global_noise) / 12.0))
        if global_noise < 2.5:
            indicators.append({
                "name": "Sensor Noise Attenuation",
                "status": "anomaly",
                "severity": "medium",
                "score": round(noise_score, 2),
                "description": f"Unusually low sensor noise residual ({global_noise:.1f}), characteristic of synthetic diffusion or heavy post-processing denoising."
            })
            anomaly_weights.append(0.20 * noise_score)
        else:
            indicators.append({
                "name": "Sensor Noise Floor",
                "status": "normal",
                "severity": "none",
                "score": 0.15,
                "description": f"Normal sensor noise pattern ({global_noise:.1f} std) consistent with physical camera sensors."
            })

        # Dynamic Confidence & Risk Calculation
        # Aggregate anomaly score
        if anomaly_weights:
            total_anomaly_score = sum(anomaly_weights) / (0.35 + 0.25 + (0.40 if face_features else 0.0) + 0.20)
            
            # Multi-anomaly synergy bonus (when multiple independent forensic vectors agree)
            anomaly_count = len([i for i in indicators if i.get("status") == "anomaly"])
            if anomaly_count >= 2:
                total_anomaly_score = total_anomaly_score + 0.15 * (anomaly_count - 1)

            total_anomaly_score = min(0.96, max(0.12, total_anomaly_score))
        else:
            total_anomaly_score = 0.14

        # Decision threshold: 0.50
        if total_anomaly_score >= 0.52:
            prediction = "POTENTIALLY MANIPULATED"
            confidence = round(total_anomaly_score * 100, 1)
            risk_level = "HIGH" if confidence >= 75.0 else "MEDIUM"
        else:
            prediction = "LIKELY AUTHENTIC"
            confidence = round((1.0 - total_anomaly_score) * 100, 1)
            # Bound confidence so it's realistic (never 100%)
            confidence = min(95.4, max(58.0, confidence))
            risk_level = "LOW"

        return {
            "prediction": prediction,
            "confidence": confidence,
            "risk_level": risk_level,
            "detector_name": self.name,
            "indicators": indicators,
            "raw_anomaly_score": round(total_anomaly_score, 3)
        }

    def detect_video(self, video_path: str, sampled_frames_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze sampled video frames, measure temporal jitter, and produce aggregated verdict.
        """
        if not sampled_frames_data:
            return {
                "prediction": "LIKELY AUTHENTIC",
                "confidence": 60.0,
                "risk_level": "LOW",
                "detector_name": self.name,
                "indicators": [],
                "raw_anomaly_score": 0.2
            }

        total_frames = len(sampled_frames_data)
        suspicious_frames = [f for f in sampled_frames_data if f.get("status") == "Suspicious"]
        suspicious_ratio = len(suspicious_frames) / total_frames

        # Average anomaly score
        scores = [f.get("anomaly_score", 0.2) for f in sampled_frames_data]
        mean_score = float(np.mean(scores))
        
        indicators = []

        # 1. Sampled Frame Coverage Indicator
        indicators.append({
            "name": f"Temporal Frame Sampling ({total_frames} frames)",
            "status": "normal",
            "severity": "none",
            "score": round(min(1.0, total_frames / 20.0), 2),
            "description": f"Analyzed {total_frames} representative frames across video timeline for inter-frame forensic continuity."
        })

        # 2. Frame-level Inconsistency Indicator
        if suspicious_ratio > 0.25:
            indicators.append({
                "name": "Temporal Face & Landmark Inconsistency",
                "status": "anomaly",
                "severity": "high" if suspicious_ratio > 0.5 else "medium",
                "score": round(suspicious_ratio, 2),
                "description": f"{len(suspicious_frames)} of {total_frames} sampled frames ({suspicious_ratio*100:.0f}%) exhibited anomalous face jitter or texture shifts."
            })
        else:
            indicators.append({
                "name": "Temporal Frame Continuity",
                "status": "normal",
                "severity": "none",
                "score": round(suspicious_ratio, 2),
                "description": f"Low inter-frame anomaly frequency ({len(suspicious_frames)}/{total_frames} frames flagged). Motion and textures appear coherent."
            })

        # 3. Aggregated Verdict
        if suspicious_ratio >= 0.30 or mean_score >= 0.50:
            prediction = "POTENTIALLY MANIPULATED"
            confidence = round(min(94.8, max(68.0, (mean_score * 0.5 + suspicious_ratio * 0.5) * 100)), 1)
            risk_level = "HIGH" if confidence > 80.0 else "MEDIUM"
        else:
            prediction = "LIKELY AUTHENTIC"
            confidence = round(min(93.5, max(62.0, (1.0 - mean_score) * 100)), 1)
            risk_level = "LOW"

        return {
            "prediction": prediction,
            "confidence": confidence,
            "risk_level": risk_level,
            "detector_name": self.name,
            "indicators": indicators,
            "raw_anomaly_score": round(mean_score, 3)
        }
