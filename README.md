# VisionTrace AI – AI-Based Deepfake Detection System
> **Powered by DeepGuard Forensics Core**  
> *Academic Prototype for Software-Based Deepfake Detection Using Artificial Intelligence & Machine Learning*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=flat&logo=react)](https://react.dev)
[![OpenCV](https://img.shields.io/badge/Computer_Vision-OpenCV_4.x-5C3EE8?style=flat&logo=opencv)](https://opencv.org)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?style=flat&logo=sqlite)](https://sqlite.org)
[![Tests](https://img.shields.io/badge/Tests-8%20Passed%20(100%25)-success)](#automated-testing)

---

## 1. Project Overview

**VisionTrace AI** is a complete, fully functional full-stack academic software system designed to analyze suspicious digital media (images and videos) for indicators of deepfake manipulation, digital splicing, and generative synthesis (GAN / Diffusion artifacts).

The system integrates a transparent **Detection Engine** implementing multi-factor computer-vision heuristics and statistical forensics:
- **Haar Cascade Facial Region Segmentation**
- **Error Level Analysis (ELA)** across JPEG discrete cosine transform blocks
- **2D Fast Fourier Transform (FFT)** power spectrum analysis to identify periodic up-convolution grid artifacts
- **Laplacian Boundary Edge Dispersion** to measure unnatural smoothing vs sharp splicing seams
- **Sensor Noise Consistency** (median residual variance)
- **Temporal Keyframe Sampling & Landmark Jitter Tracking** for video media
- **Explainable AI (XAI)** translating statistical anomalies into plain English
- **Automated Forensic Report Generation** (Downloadable PDF via ReportLab + printable HTML)
- **Database-Backed Audit Log** in SQLite with search, filtering, and deletion

---

## 2. Academic Concept & Research Alignment

The prototype models the canonical academic forensic pipeline:
```
USER INPUT
   │
   ▼
[Step 1: File Validation & Sanitization]
   │
   ▼
[Step 2: Pre-Processing & Aspect Normalization]
   │
   ▼
[Step 3: Face Detection & ROI Isolation]
   │
   ▼
[Step 4: Feature Extraction (ELA, FFT, Laplacian, Noise, Video Sampling)]
   │
   ▼
[Step 5: AI/ML Detection Engine Fusion]
   │
   ▼
[Step 6: Confidence Calculation & Risk Mapping (LOW / MEDIUM / HIGH)]
   │
   ▼
[Step 7: Explainable Result Generation (Preserving Uncertainty)]
   │
   ▼
[Step 8: Persistence & Downloadable PDF Report]
```

---

## 3. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Responsive cybersecurity dark-mode UI, live meters & HUD overlays |
| **Backend** | Python 3.10+, FastAPI, Uvicorn | High-throughput asynchronous REST API & file streaming |
| **Forensics / CV** | OpenCV (`opencv-python<5`), Pillow, NumPy | Haar Cascades, ELA, 2D FFT, Laplacian, noise residuals |
| **Database** | SQLite 3 | Embedded persistent database storing predictions, metadata, and audit logs |
| **Reporting** | ReportLab | Forensic PDF report generator with executive summary and indicator tables |
| **Testing** | Pytest, TestClient | Automated test suite verifying health, uploads, DB CRUD, and reports |

---

## 4. Directory Structure

```
visiontrace-ai/
├── backend/
│   ├── database.py                 # SQLite database schema, CRUD, and telemetry aggregations
│   ├── models.py                   # Pydantic data schemas
│   ├── generate_samples.py         # Script generating benchmark authentic/manipulated media
│   ├── main.py                     # FastAPI application, CORS, static file mounts
│   ├── detectors/
│   │   ├── base.py                 # Abstract Base Detector interface
│   │   ├── baseline_detector.py    # AI-Assisted Baseline Detector (forensic & statistical)
│   │   └── engine.py               # Pluggable DetectionEngine orchestrator
│   ├── routes/
│   │   ├── analysis.py             # 8-step image/video processing endpoints
│   │   ├── history.py              # Query, search, filter, and delete past analyses
│   │   ├── report.py               # Downloadable PDF & HTML report endpoints
│   │   └── demo.py                 # Bundled demo sample evaluation endpoints
│   ├── services/
│   │   ├── file_service.py         # Extension validation, MIME check, and safe file saving
│   │   ├── face_detector.py        # Haar Cascade face detector & HUD visual overlay generator
│   │   ├── image_analysis.py       # ELA, FFT, Laplacian edge variance, and noise residuals
│   │   ├── video_analysis.py       # Intelligent video frame sampler & temporal consistency
│   │   ├── explanation_service.py  # Plain-English forensic explainability generator
│   │   └── report_service.py       # ReportLab PDF & printable HTML report generator
│   ├── samples/                    # Bundled benchmark test files (authentic, manipulated, video)
│   ├── uploads/                    # User uploaded media and annotated overlays (/processed)
│   └── reports/                    # Cached PDF forensic reports
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Footer, UploadZone, PipelineProgress, ResultCard, etc.
│   │   ├── pages/                  # LandingPage, DashboardPage, AnalyzePage, HistoryPage, etc.
│   │   ├── services/api.js         # Axios / Fetch client connecting to FastAPI backend
│   │   ├── App.jsx                 # Main layout and page router
│   │   └── index.css               # Tailwind CSS & cybersecurity theme styling
│   ├── package.json
│   └── vite.config.js              # Vite config with Tailwind & proxy for /api and /uploads
├── tests/
│   └── test_api.py                 # Pytest test suite covering full API workflow
├── run_project.bat                 # Windows convenience launcher for full application
├── start_backend.bat               # Windows convenience launcher for backend
├── start_frontend.bat              # Windows convenience launcher for frontend
└── README.md
```

---

## 5. Quick Start Guide

### Prerequisites
- Python 3.10+ (tested and verified with Python 3.14)
- Node.js 18+ and npm

### Installation Commands

#### 1. Install Backend Dependencies
Open PowerShell or Command Prompt:
```powershell
cd C:\Users\suyas\.gemini\antigravity\scratch\visiontrace-ai
pip install fastapi uvicorn python-multipart "opencv-python<5" pillow numpy reportlab pytest httpx
```

#### 2. Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## 6. Running the Application

### Option A: 1-Click Launch (Windows)
Double-click `run_project.bat` or run:
```powershell
.\run_project.bat
```
This automatically starts both the FastAPI backend and Vite frontend in separate terminal windows.

### Option B: Manual Execution in 2 Terminals

#### Terminal 1 — Backend (FastAPI):
```powershell
cd C:\Users\suyas\.gemini\antigravity\scratch\visiontrace-ai\backend
python main.py
```
*Backend runs on: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)*

#### Terminal 2 — Frontend (Vite + React):
```powershell
cd C:\Users\suyas\.gemini\antigravity\scratch\visiontrace-ai\frontend
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

Open `http://localhost:5173` in your browser to access the complete application!

---

## 7. Using the System

1. **Dashboard**: View real-time SQLite statistics (Total Analyses, Deepfakes Detected, Real Media, Average Confidence) and recent queries.
2. **Start Analysis**:
   - Drag and drop any image (`JPG`, `PNG`, `WEBP`) or video (`MP4`, `MOV`, `AVI`).
   - Or click **“Try Bundled Demo Samples”** for instant 1-click evaluation of authentic vs manipulated benchmark media.
3. **Inspect Results**:
   - **Verdict Banner**: `POTENTIALLY MANIPULATED` or `LIKELY AUTHENTIC`.
   - **Confidence Meter**: 0–100% statistical certainty.
   - **Risk Level**: `LOW`, `MEDIUM`, or `HIGH`.
   - **Visual Evidence**: View original media vs annotated HUD overlay with face bounding boxes and anomaly callouts. For videos, inspect the interactive frame timeline and frame-by-frame log table.
   - **Explainable AI**: Read the plain-English explanation detailing why the system made its determination.
4. **Download Report**: Click **“Download PDF Report”** for a formal forensic report generated with ReportLab.
5. **History Management**: Navigate to **“History”** to search, filter by media type or verdict, sort, view previous reports, or permanently delete records.

---

## 8. Automated Testing

The backend includes a comprehensive automated test suite in `tests/test_api.py`.
Run the tests using:
```powershell
cd C:\Users\suyas\.gemini\antigravity\scratch\visiontrace-ai
python -m pytest tests/test_api.py -v
```

**Test Suite Coverage:**
- `test_health_check`: Verifies API health and engine initialization.
- `test_demo_samples_list`: Verifies demo catalog availability.
- `test_run_demo_authentic`: Tests image analysis pipeline with authentic media.
- `test_run_demo_manipulated`: Tests anomaly detection with altered media.
- `test_history_and_stats`: Tests SQLite persistence and dashboard metrics.
- `test_report_generation`: Validates both HTML and ReportLab PDF streaming.
- `test_delete_analysis`: Verifies database deletion and disk file cleanup.
- `test_invalid_file_upload`: Confirms validation and rejection of invalid file types.

---

## 9. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, engine identifier, and DB connection check |
| `POST` | `/api/analyze` | Upload and execute 8-stage detection pipeline on media file |
| `GET` | `/api/stats` | Dashboard statistics (totals, averages, recent records) |
| `GET` | `/api/analyses` | Query, filter (`type`, `prediction`), and search history records |
| `GET` | `/api/analyses/{id}` | Retrieve individual analysis record by ID |
| `DELETE`| `/api/analyses/{id}` | Permanently delete analysis record and associated media files |
| `GET` | `/api/report/{id}/pdf` | Stream downloadable ReportLab PDF forensic report |
| `GET` | `/api/report/{id}/html`| Render printable HTML forensic report |
| `GET` | `/api/demo/samples` | List bundled benchmark demo samples |
| `POST` | `/api/demo/analyze/{id}`| Execute full 8-step pipeline on a demo sample |

Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## 10. Research Limitations & Academic Disclaimers

> [!WARNING]  
> **Academic Prototype Disclaimer:**  
> This system is an academic research prototype. Deepfake detection is fundamentally **probabilistic**. Benchmark performance does not guarantee reliable detection of unseen manipulations, high-resolution generative diffusion, or heavily compressed media transmissions.  
>  
> **“AI-assisted detection provides an indication of possible manipulation, not definitive proof. Results should not replace qualified human expert verification for high-stakes or legal decisions.”**

---

## 11. Future Extensions

- **Deep Learning Detectors**: Integrate trained CNN models (e.g., MesoNet, EfficientNet-B4) or Vision Transformers via the pluggable `BaseDetector` interface.
- **Audio Forensics**: Add bi-modal analysis evaluating audio-visual lip synchronization and acoustic spectrogram consistency.
- **Ensemble Fusion**: Implement Bayesian or random-forest ensemble weighting combining heuristic and deep-learning models.
