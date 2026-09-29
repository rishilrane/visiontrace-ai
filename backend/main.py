import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import database
from routes.analysis import router as analysis_router
from routes.history import router as history_router
from routes.report import router as report_router
from routes.demo import router as demo_router

# Initialize SQLite database on boot
database.init_db()

app = FastAPI(
    title="VisionTrace AI – Deepfake Detection API",
    description="Backend API for VisionTrace AI (Powered by DeepGuard Core) deepfake detection prototype.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_DIR, "processed"), exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.mount("/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")

# Register API Routers
app.include_router(analysis_router)
app.include_router(history_router)
app.include_router(report_router)
app.include_router(demo_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "VisionTrace AI Prototype",
        "engine": "AI-Assisted Baseline Detector (Forensic & Statistical)",
        "database": "SQLite (Connected)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)

