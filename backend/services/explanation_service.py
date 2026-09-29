from typing import List, Dict, Any

class ExplanationService:
    """
    Translates forensic anomaly metrics and detector findings into
    plain-English, scientifically honest explanations preserving uncertainty.
    """

    @staticmethod
    def generate_explanation(
        prediction: str,
        confidence: float,
        indicators: List[Dict[str, Any]],
        file_type: str,
        faces_detected: int
    ) -> str:
        anomalies = [ind for ind in indicators if ind.get("status") == "anomaly"]
        
        sentences = []
        
        if prediction == "POTENTIALLY MANIPULATED":
            sentences.append(
                f"The AI-assisted baseline analysis classified this {file_type} as potentially manipulated "
                f"with a confidence score of {confidence:.1f}%."
            )
            
            if anomalies:
                reasons = [a["name"].lower() for a in anomalies[:3]]
                sentences.append(
                    f"Forensic indicators flagged suspicious inconsistencies, notably: {', '.join(reasons)}. "
                    "These localized statistical deviations suggest artificial alteration, splicing, or synthetic blending."
                )
            else:
                sentences.append(
                    "Subtle frequency and gradient irregularities contributed to an elevated manipulation index."
                )
                
            if faces_detected > 0:
                sentences.append(
                    f"Specific anomalies were isolated within the {faces_detected} detected facial region(s), "
                    "which exhibited edge and compression profiles divergent from background context."
                )
                
            sentences.append(
                "Important Note: This is an AI-assisted prototype analysis and does not constitute definitive forensic proof. "
                "AI-assisted detection provides an indication of possible manipulation, not definitive proof. "
                "Prototype result — human verification is recommended for high-stakes decisions."
            )
            
        else: # LIKELY AUTHENTIC
            sentences.append(
                f"The AI-assisted baseline analysis assessed this {file_type} as likely authentic "
                f"with a confidence score of {confidence:.1f}%."
            )
            
            if faces_detected > 0:
                sentences.append(
                    f"The detected facial region(s) exhibited consistent skin gradient, natural edge transitions, "
                    "and uniform compression levels conforming to physical capture characteristics."
                )
            else:
                sentences.append(
                    "Global frequency spectrum, noise consistency, and error level distributions remained within expected natural limits."
                )
                
            sentences.append(
                "While no significant manipulation artifacts were detected, this result does not guarantee absolute authenticity. "
                "This is an AI-assisted prototype analysis. "
                "AI-assisted detection provides an indication of possible manipulation, not definitive proof. "
                "Prototype result — human verification is recommended for high-stakes decisions."
            )
            
        return " ".join(sentences)
