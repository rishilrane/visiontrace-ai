import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_dir)

from main import app
import database

client = TestClient(app)

def setup_module(module):
    """Ensure database is initialized before tests"""
    database.init_db()

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "VisionTrace" in data["system"]

def test_demo_samples_list():
    response = client.get("/api/demo/samples")
    assert response.status_code == 200
    samples = response.json()
    assert len(samples) >= 3
    sample_ids = [s["id"] for s in samples]
    assert "authentic_portrait" in sample_ids
    assert "manipulated_face" in sample_ids
    assert "sample_video" in sample_ids

def test_run_demo_authentic():
    response = client.post("/api/demo/analyze/authentic_portrait")
    assert response.status_code == 200
    result = response.json()
    
    assert "id" in result
    assert result["file_type"] == "image"
    assert "prediction" in result
    assert "confidence" in result
    assert "risk_level" in result
    assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert "indicators" in result
    assert len(result["indicators"]) > 0
    assert "explanation" in result
    assert "AI-assisted prototype" in result["explanation"]
    assert result["processing_time"] >= 0

def test_run_demo_manipulated():
    response = client.post("/api/demo/analyze/manipulated_face")
    assert response.status_code == 200
    result = response.json()
    
    assert "id" in result
    assert result["file_type"] == "image"
    assert "prediction" in result
    assert result["prediction"] == "POTENTIALLY MANIPULATED"
    assert result["risk_level"] in ["MEDIUM", "HIGH"]
    # Verify at least one anomaly indicator was flagged
    anomalies = [i for i in result["indicators"] if i["status"] == "anomaly"]
    assert len(anomalies) > 0

def test_history_and_stats():
    # Fetch stats
    stats_resp = client.get("/api/stats")
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert stats["total_analyses"] >= 2
    assert "avg_confidence" in stats

    # Fetch history list
    hist_resp = client.get("/api/analyses")
    assert hist_resp.status_code == 200
    history = hist_resp.json()
    assert len(history) >= 2
    
    # Test filtering
    img_resp = client.get("/api/analyses?type=image")
    assert img_resp.status_code == 200
    assert all(item["file_type"] == "image" for item in img_resp.json())

def test_report_generation():
    # Get latest analysis ID
    hist_resp = client.get("/api/analyses")
    records = hist_resp.json()
    assert len(records) > 0
    test_id = records[0]["id"]

    # HTML Report
    html_resp = client.get(f"/api/report/{test_id}/html")
    assert html_resp.status_code == 200
    assert "VisionTrace AI" in html_resp.text

    # PDF Report
    pdf_resp = client.get(f"/api/report/{test_id}/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 1000

def test_delete_analysis():
    # Insert or run demo to get an ID to delete
    res = client.post("/api/demo/analyze/authentic_portrait")
    analysis_id = res.json()["id"]

    # Delete it
    del_resp = client.delete(f"/api/analyses/{analysis_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "success"

    # Confirm it's gone
    get_resp = client.get(f"/api/analyses/{analysis_id}")
    assert get_resp.status_code == 404

def test_invalid_file_upload():
    # Unsupported file extension (.exe or .txt)
    files = {"file": ("malicious.exe", b"binary content", "application/x-msdownload")}
    resp = client.post("/api/analyze", files=files)
    assert resp.status_code == 400
    assert "Unsupported file format" in resp.json()["detail"]

def test_direct_image_upload_analysis():
    sample_img_path = os.path.join(backend_dir, "samples", "sample_authentic_portrait.jpg")
    with open(sample_img_path, "rb") as f:
        files = {"file": ("test_portrait.jpg", f, "image/jpeg")}
        resp = client.post("/api/analyze", files=files)
    assert resp.status_code == 200
    data = resp.json()
    assert data["file_type"] == "image"
    assert "confidence" in data
    assert "prediction" in data
    assert data["faces_detected"] >= 1

def test_direct_video_upload_analysis():
    sample_vid_path = os.path.join(backend_dir, "samples", "sample_forensic_video.mp4")
    with open(sample_vid_path, "rb") as f:
        files = {"file": ("test_video.mp4", f, "video/mp4")}
        resp = client.post("/api/analyze", files=files)
    assert resp.status_code == 200
    data = resp.json()
    assert data["file_type"] == "video"
    assert "confidence" in data
    assert "prediction" in data
    assert len(data["frame_details"]) > 0
    assert data["frames_analyzed"] > 0

