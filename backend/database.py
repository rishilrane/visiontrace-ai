import sqlite3
import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "visiontrace.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            processed_path TEXT,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            risk_level TEXT NOT NULL,
            detector_name TEXT NOT NULL,
            faces_detected INTEGER NOT NULL,
            frames_analyzed INTEGER NOT NULL,
            indicators TEXT NOT NULL,
            explanation TEXT NOT NULL,
            metadata_info TEXT,
            frame_details TEXT,
            processing_time REAL NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def insert_analysis(data: Dict[str, Any]) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    
    indicators_json = json.dumps(data.get("indicators", []))
    metadata_json = json.dumps(data.get("metadata_info", {}))
    frames_json = json.dumps(data.get("frame_details", []))
    
    cursor.execute("""
        INSERT INTO analyses (
            id, filename, file_type, file_size, file_path, processed_path,
            prediction, confidence, risk_level, detector_name, faces_detected,
            frames_analyzed, indicators, explanation, metadata_info, frame_details,
            processing_time, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["id"],
        data["filename"],
        data["file_type"],
        data.get("file_size", 0),
        data["file_path"],
        data.get("processed_path", ""),
        data["prediction"],
        data["confidence"],
        data["risk_level"],
        data.get("detector_name", "AI-Assisted Baseline Detector"),
        data.get("faces_detected", 0),
        data.get("frames_analyzed", 1),
        indicators_json,
        data["explanation"],
        metadata_json,
        frames_json,
        data.get("processing_time", 0.0),
        data.get("created_at", datetime.now().isoformat())
    ))
    conn.commit()
    conn.close()
    return data["id"]

def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    item = dict(row)
    try:
        item["indicators"] = json.loads(item["indicators"]) if item["indicators"] else []
    except Exception:
        item["indicators"] = []
    try:
        item["metadata_info"] = json.loads(item["metadata_info"]) if item["metadata_info"] else {}
    except Exception:
        item["metadata_info"] = {}
    try:
        item["frame_details"] = json.loads(item["frame_details"]) if item["frame_details"] else []
    except Exception:
        item["frame_details"] = []
    return item

def get_all_analyses(
    media_type: Optional[str] = None,
    prediction: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "newest"
) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM analyses WHERE 1=1"
    params = []
    
    if media_type and media_type.lower() != "all":
        query += " AND file_type = ?"
        params.append(media_type.lower())
        
    if prediction and prediction.lower() != "all":
        if prediction.lower() == "real":
            query += " AND prediction LIKE '%AUTHENTIC%'"
        elif prediction.lower() in ("deepfake", "manipulated"):
            query += " AND prediction LIKE '%MANIPULATED%'"
            
    if search:
        query += " AND (filename LIKE ? OR id LIKE ? OR explanation LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])
        
    if sort_by == "oldest":
        query += " ORDER BY created_at ASC"
    elif sort_by == "confidence":
        query += " ORDER BY confidence DESC"
    else:
        query += " ORDER BY created_at DESC"
        
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(r) for r in rows]

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row) if row else None

def delete_analysis(analysis_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    
    # Get file paths to delete files on disk
    cursor.execute("SELECT file_path, processed_path FROM analyses WHERE id = ?", (analysis_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return False
        
    cursor.execute("DELETE FROM analyses WHERE id = ?", (analysis_id,))
    conn.commit()
    conn.close()
    
    # Remove files if exist
    for p in (row["file_path"], row["processed_path"]):
        if p and os.path.exists(p) and not "samples" in p:
            try:
                os.remove(p)
            except Exception:
                pass
                
    return True

def get_dashboard_stats() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM analyses")
    total_analyses = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analyses WHERE prediction LIKE '%MANIPULATED%'")
    deepfakes_detected = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM analyses WHERE prediction LIKE '%AUTHENTIC%'")
    real_media = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(confidence) FROM analyses")
    avg_conf_row = cursor.fetchone()[0]
    avg_confidence = round(float(avg_conf_row * 100), 1) if avg_conf_row else 0.0
    
    cursor.execute("SELECT * FROM analyses ORDER BY created_at DESC LIMIT 5")
    recent_rows = cursor.fetchall()
    conn.close()
    
    return {
        "total_analyses": total_analyses,
        "deepfakes_detected": deepfakes_detected,
        "real_media": real_media,
        "avg_confidence": avg_confidence,
        "recent_analyses": [row_to_dict(r) for r in recent_rows]
    }
