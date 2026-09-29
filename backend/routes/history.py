from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
import database

router = APIRouter(prefix="/api", tags=["History & Statistics"])

@router.get("/analyses")
def list_analyses(
    type: Optional[str] = Query(None, description="Filter by 'image' or 'video' or 'all'"),
    prediction: Optional[str] = Query(None, description="Filter by 'real' or 'manipulated' or 'all'"),
    search: Optional[str] = Query(None, description="Search keyword in filename, id, or explanation"),
    sort: str = Query("newest", description="'newest', 'oldest', or 'confidence'")
):
    """
    Retrieve filterable, searchable, and sortable list of past analyses from SQLite.
    """
    records = database.get_all_analyses(
        media_type=type,
        prediction=prediction,
        search=search,
        sort_by=sort
    )
    return records

@router.get("/analyses/{analysis_id}")
def get_analysis_detail(analysis_id: str):
    """
    Fetch single analysis result by ID.
    """
    record = database.get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Analysis ID '{analysis_id}' not found.")
    return record

@router.delete("/analyses/{analysis_id}")
def remove_analysis(analysis_id: str):
    """
    Delete analysis record from database and clean up associated stored files.
    """
    success = database.delete_analysis(analysis_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Analysis ID '{analysis_id}' not found or already deleted.")
    return {"status": "success", "message": f"Analysis record '{analysis_id}' deleted successfully."}

@router.get("/stats")
def get_stats():
    """
    Live statistics for dashboard counters:
    Total analyses, deepfakes detected, real media, and average confidence.
    """
    return database.get_dashboard_stats()
