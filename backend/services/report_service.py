import os
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)

class ReportService:
    @staticmethod
    def generate_pdf_report(analysis: Dict[str, Any], output_pdf_path: str) -> str:
        """
        Generate an academic forensic analysis PDF report using ReportLab.
        """
        os.makedirs(os.path.dirname(output_pdf_path), exist_ok=True)
        doc = SimpleDocTemplate(
            output_pdf_path,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0f172a")
        )
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#0284c7")
        )
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#1e293b"),
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#334155")
        )
        verdict_style = ParagraphStyle(
            'VerdictText',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#dc2626") if "MANIPULATED" in analysis.get("prediction", "") else colors.HexColor("#16a34a")
        )
        disclaimer_style = ParagraphStyle(
            'DisclaimerText',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#64748b")
        )

        story = []

        # 1. Header
        story.append(Paragraph("VisionTrace AI – DeepGuard Forensics", title_style))
        story.append(Paragraph("AI-Based Deepfake Detection & Visual Forensics Verification Report", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284c7"), spaceAfter=12))

        # 2. Executive Summary Table
        pred = analysis.get("prediction", "UNKNOWN")
        conf = analysis.get("confidence", 0.0)
        risk = analysis.get("risk_level", "UNKNOWN")

        summary_data = [
            [
                Paragraph("<b>Analysis Reference ID:</b>", body_style),
                Paragraph(analysis.get("id", "N/A"), body_style),
                Paragraph("<b>Date & Time:</b>", body_style),
                Paragraph(analysis.get("created_at", "N/A"), body_style)
            ],
            [
                Paragraph("<b>File Name:</b>", body_style),
                Paragraph(analysis.get("filename", "N/A"), body_style),
                Paragraph("<b>Media Type:</b>", body_style),
                Paragraph(analysis.get("file_type", "image").upper(), body_style)
            ],
            [
                Paragraph("<b>Detection Verdict:</b>", body_style),
                Paragraph(pred, verdict_style),
                Paragraph("<b>Confidence Score:</b>", body_style),
                Paragraph(f"<b>{conf:.1f}%</b> ({risk} RISK)", body_style)
            ],
            [
                Paragraph("<b>Faces Detected:</b>", body_style),
                Paragraph(str(analysis.get("faces_detected", 0)), body_style),
                Paragraph("<b>Frames Evaluated:</b>", body_style),
                Paragraph(str(analysis.get("frames_analyzed", 1)), body_style)
            ],
            [
                Paragraph("<b>Detection Engine:</b>", body_style),
                Paragraph(analysis.get("detector_name", "AI-Assisted Baseline Detector"), body_style),
                Paragraph("<b>Processing Latency:</b>", body_style),
                Paragraph(f"{analysis.get('processing_time', 0.0):.2f} seconds", body_style)
            ]
        ]

        summary_table = Table(summary_data, colWidths=[130, 140, 130, 140])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(summary_table)
        story.append(Spacer(1, 14))

        # 3. Detection Indicators Table
        story.append(Paragraph("Forensic Indicators & Anomaly Breakdown", heading_style))
        indicators = analysis.get("indicators", [])
        
        ind_table_data = [
            [
                Paragraph("<b>Indicator</b>", body_style),
                Paragraph("<b>Status</b>", body_style),
                Paragraph("<b>Severity</b>", body_style),
                Paragraph("<b>Forensic Description</b>", body_style)
            ]
        ]
        
        for ind in indicators:
            status_color = "#dc2626" if ind.get("status") == "anomaly" else "#16a34a"
            status_text = f"<font color='{status_color}'><b>{ind.get('status', '').upper()}</b></font>"
            ind_table_data.append([
                Paragraph(ind.get("name", "Indicator"), body_style),
                Paragraph(status_text, body_style),
                Paragraph(ind.get("severity", "none").upper(), body_style),
                Paragraph(ind.get("description", ""), body_style)
            ])
            
        if len(ind_table_data) > 1:
            ind_table = Table(ind_table_data, colWidths=[140, 65, 65, 270])
            ind_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
                ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
                ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(ind_table)
        else:
            story.append(Paragraph("No anomalous indicators recorded.", body_style))
            
        story.append(Spacer(1, 14))

        # 4. Explainability Section
        story.append(Paragraph("Explainable Analysis & Findings", heading_style))
        story.append(Paragraph(analysis.get("explanation", "No detailed explanation recorded."), body_style))
        story.append(Spacer(1, 14))

        # 5. Technical Methodology Notes
        story.append(Paragraph("Technical Methodology", heading_style))
        method_text = (
            "This analysis was performed using the VisionTrace AI Baseline Detection Engine. "
            "The pipeline extracts facial regions of interest via Haar Cascade classification, evaluates compression "
            "inconsistencies via Error Level Analysis (ELA), analyzes 2D Fast Fourier Transform (FFT) power spectrum distributions "
            "for convolutional upsampling signatures, measures Laplacian boundary gradient dispersion, and tests sensor noise "
            "consistency. For video media, temporal landmark displacement and inter-frame feature variance are tracked across "
            "intelligently sampled keyframes."
        )
        story.append(Paragraph(method_text, body_style))
        story.append(Spacer(1, 14))

        # 6. Academic Limitations & Disclaimer
        story.append(Paragraph("Limitations & Academic Prototype Disclaimer", heading_style))
        disclaimer_text = (
            "<b>Disclaimer:</b> This is an AI-assisted academic prototype analysis and should not be treated as definitive "
            "forensic proof or legal evidence. Deepfake detection is fundamentally probabilistic. High-grade adversarial "
            "manipulations, heavy compression re-encoding, or non-standard cameras may affect heuristic reliability. "
            "AI-assisted detection provides an indication of possible manipulation, not definitive proof. "
            "Human expert review and secondary verification are strongly recommended for high-stakes decisions."
        )
        story.append(Paragraph(disclaimer_text, disclaimer_style))

        doc.build(story)
        return output_pdf_path

    @staticmethod
    def generate_html_report(analysis: Dict[str, Any]) -> str:
        """
        Generate printable HTML version of the report.
        """
        pred = analysis.get("prediction", "UNKNOWN")
        conf = analysis.get("confidence", 0.0)
        risk = analysis.get("risk_level", "UNKNOWN")
        is_manip = "MANIPULATED" in pred
        badge_color = "#ef4444" if is_manip else "#22c55e"
        
        indicators_html = ""
        for ind in analysis.get("indicators", []):
            st_color = "#ef4444" if ind.get("status") == "anomaly" else "#22c55e"
            indicators_html += f"""
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px; font-weight: 600;">{ind.get('name')}</td>
                <td style="padding: 8px; color: {st_color}; font-weight: bold;">{ind.get('status').upper()}</td>
                <td style="padding: 8px;">{ind.get('severity').upper()}</td>
                <td style="padding: 8px; color: #475569;">{ind.get('description')}</td>
            </tr>
            """

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>VisionTrace AI Report - {analysis.get('id')}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 40px; }}
        .report-card {{ max-width: 800px; margin: 0 auto; background: #ffffff; padding: 36px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }}
        .header {{ border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f1f5f9; padding: 16px; border-radius: 6px; margin-bottom: 24px; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 4px; color: #fff; background: {badge_color}; font-weight: bold; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }}
        th {{ background: #e2e8f0; padding: 8px; text-align: left; }}
        .disclaimer {{ font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; font-style: italic; }}
        @media print {{ body {{ margin: 0; background: #fff; }} .report-card {{ box-shadow: none; border: none; }} }}
    </style>
</head>
<body>
    <div class="report-card">
        <div class="header">
            <h1 style="margin: 0; color: #0f172a; font-size: 24px;">VisionTrace AI – DeepGuard Forensics</h1>
            <p style="margin: 4px 0 0 0; color: #0284c7; font-size: 13px;">AI-Based Deepfake Detection & Visual Forensics Verification Report</p>
        </div>
        
        <div class="grid">
            <div><strong>Analysis ID:</strong> {analysis.get('id')}</div>
            <div><strong>Date:</strong> {analysis.get('created_at')}</div>
            <div><strong>Filename:</strong> {analysis.get('filename')}</div>
            <div><strong>Media Type:</strong> {analysis.get('file_type', '').upper()}</div>
            <div><strong>Detection Verdict:</strong> <span class="badge">{pred}</span></div>
            <div><strong>Confidence:</strong> {conf:.1f}% ({risk} RISK)</div>
            <div><strong>Faces Isolated:</strong> {analysis.get('faces_detected')}</div>
            <div><strong>Frames Analyzed:</strong> {analysis.get('frames_analyzed')}</div>
            <div><strong>Engine:</strong> {analysis.get('detector_name')}</div>
            <div><strong>Latency:</strong> {analysis.get('processing_time', 0.0):.2f}s</div>
        </div>

        <h3 style="border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Forensic Detection Indicators</h3>
        <table>
            <thead><tr><th>Indicator</th><th>Status</th><th>Severity</th><th>Description</th></tr></thead>
            <tbody>{indicators_html}</tbody>
        </table>

        <h3 style="border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Explainable Analysis & Findings</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">{analysis.get('explanation')}</p>

        <h3 style="border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Methodology</h3>
        <p style="font-size: 13px; line-height: 1.5; color: #475569;">
            Analyzed using multi-factor baseline visual forensics: Haar Cascade facial ROI segmentation, Error Level Analysis (ELA),
            2D FFT power spectrum distribution, Laplacian edge gradient variance, and inter-frame temporal landmark consistency.
        </p>

        <div class="disclaimer">
            <strong>Disclaimer:</strong> This is an AI-assisted academic prototype analysis and should not be treated as definitive forensic proof.
            Deepfake detection is probabilistic. AI-assisted detection provides an indication of possible manipulation, not definitive proof.
            Human verification is recommended for high-stakes decisions.
        </div>
    </div>
</body>
</html>"""
        return html
