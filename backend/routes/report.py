import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from services.report_service import ReportService
import database

router = APIRouter(prefix="/api", tags=["Reports"])

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

@router.get("/report/{analysis_id}/pdf")
def download_pdf_report(analysis_id: str):
    """
    Generate and serve a downloadable forensic PDF report.
    """
    record = database.get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    pdf_filename = f"VisionTrace_Report_{analysis_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    # Ensure PDF exists or generate on demand
    try:
        ReportService.generate_pdf_report(record, pdf_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=pdf_filename,
        headers={"Content-Disposition": f"attachment; filename={pdf_filename}"}
    )

@router.get("/report/{analysis_id}/html", response_class=HTMLResponse)
def view_html_report(analysis_id: str):
    """
    Serve clean, printable HTML report view.
    """
    record = database.get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    html = ReportService.generate_html_report(record)
    return HTMLResponse(content=html)
