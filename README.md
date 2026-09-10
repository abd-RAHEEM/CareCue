# CareCue (Dimentia AI Companion)

CareCue is an offline-first, voice-first cognitive care platform and AI companion designed for older adults, individuals living with dementia/mild cognitive impairment, caregivers, and community health workers in India (with special focus on regional languages such as Assamese and Hindi).

This repository contains both the **Frontend Web Application** (React 19 + TypeScript + Vite + Zustand + Tailwind CSS + QR synchronization) and the **Backend API Service** (FastAPI + SQLite + Sarvam AI + Speech STT/TTS + Gemini Multi-role Companion).

---

## 🌟 Highlights & Features

### 🖥️ Frontend Experience
- **Three Dedicated Role Views**:
  - **Patient**: Home dashboard, daily routines, reminders, conversational companion, memory & family gallery, QR pairing, and 15 interactive cognitive games.
  - **Caregiver**: Real-time supervision dashboard, interactive memory graph builder, routine/medication scheduler, cognitive progression profiles, and QR connection to patient records.
  - **Health Worker**: Community patient cohort list, QR code scanner to sync patient records, clinical summary profiles, observation notes, and exportable reports.
- **QR Synchronization & Device Pairing**:
  - Offline-first QR code pairing between Patient devices and Caregiver / Health Worker devices.
  - Camera-based QR scanning and image upload scanning powered by `html5-qrcode` and `qrcode.react`.
  - Secure transfer of pairing tokens and automatic activity synchronization with the backend.
- **15 Cognitive Games**:
  - Memory Basket, My Memory Box, Recipe Recall, Sound Detective, Simon Says, Weaving Tracker, Pattern Builder, Daily Life Sequencer, Festival Memory, Object Detective, Familiar Pattern Match, Landmark Puzzle, Story Circle, Music Rhythm, and Family Music.
- **Cultural & Regional Localization**:
  - Built-in localized content packs for English and Assamese (`Frontend/src/content-packs/`).
- **Flexible Offline/Online Modes**:
  - Toggle between instant standalone offline mock mode (Zustand-backed) and real FastAPI backend integration via simple `.env.local` config.

### 🧠 Backend & AI Capabilities
- **Multi-Role Conversational AI Companion**:
  - Role-tailored prompts for Patients, Caregivers, and Health Workers with patient memory graph and context awareness.
- **Voice & Speech AI (Sarvam AI Integration)**:
  - Text-to-Speech (TTS) with natural regional voice output (`/speech/text-to-speech`) + browser speech synthesis fallback.
  - Speech-to-Text (STT) voice input (`/speech/speech-to-text`) via web audio recording.
  - Regional language translation (`/translate`) for Indic languages (Assamese `as-IN`, Hindi `hi-IN`, English `en-IN`).
- **SQLite Database & Sync Engine**:
  - Lightweight embedded database (`cognicare.db`) storing patients, events, and health worker profiles.
  - Patient activity history, batch sync endpoint (`/sync`), and cognitive performance snapshot reporting.

---

## 🏗️ Project Architecture & Structure

```text
CareCue/
├── Frontend/                          # React 19 + TypeScript + Vite SPA
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── api/                       # API integration layer (speech, assistant, activities, qrSync, etc.)
│   │   ├── components/                # Reusable UI components (AppShell, QRScanner, RoleSelector)
│   │   ├── content-packs/             # Regional cultural data packs (English, Assamese)
│   │   ├── games/                     # 15 Cognitive game modules
│   │   ├── roles/                     # Role-based pages (patient, caregiver, healthworker)
│   │   │   ├── patient/               # Patient views & PatientQRSync
│   │   │   ├── caregiver/             # Caregiver views & dashboards
│   │   │   └── healthworker/          # HW patient list, summary & HWQRSync
│   │   ├── store/                     # Zustand central state management & offline sync state
│   │   ├── types/                     # Shared TypeScript data contracts & QR sync models
│   │   ├── App.tsx                    # Main router & app shell
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                           # FastAPI Python Backend
│   ├── database.py                    # SQLite database connection & schema initialization
│   ├── models/                        # Pydantic data schemas & request models
│   ├── prompts/                       # Role-specific system prompts (patient, caregiver, health_worker)
│   ├── routes/                        # API route handlers
│   │   ├── chat.py                    # AI Companion chat routes (/chat, /chat/companion)
│   │   ├── speech.py                  # Sarvam AI TTS & STT voice routes (/speech/text-to-speech, /speech/speech-to-text)
│   │   ├── translation.py             # Language translation routes (/translate)
│   │   ├── patients.py                # Patient profiles, activities, snapshots (/patients)
│   │   └── sync.py                    # Data synchronization endpoint (/sync)
│   ├── services/                      # Sarvam AI, AI companion, context, and ReMe services
│   ├── requirements.txt               # Backend Python dependencies
│   └── main.py                        # FastAPI application entry point
│
├── DESIGN.md                          # Comprehensive design system & architecture docs
├── render.yaml                        # Render deployment configuration
├── requirements.txt                   # Root Python dependencies
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.10+)

---

### 1. Setting Up & Running the Backend

```bash
# 1. Create and activate a Python virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Configure backend environment variables
# Create a .env file in the repository root (or backend/.env):
SARVAM_API_KEY=your_sarvam_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# 4. Start the FastAPI server
uvicorn backend.main:app --reload --port 8000
```

The backend server will run at `http://127.0.0.1:8000`.
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

### 2. Setting Up & Running the Frontend

```bash
# Navigate to the Frontend directory
cd Frontend

# 1. Install dependencies
npm install

# 2. Configure frontend environment (Optional)
# In Frontend/.env.local (or create from Frontend/.env.example):
# VITE_USE_MOCK_DATA=false
# VITE_API_BASE_URL=http://127.0.0.1:8000

# 3. Start development server
npm run dev
```

The frontend will open at `http://localhost:5173`.

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health status |
| `POST` | `/chat/companion` | Conversational assistant response tailored to patient/caregiver/health worker |
| `POST` | `/translate` | Indic language translation (Assamese, Hindi, English) |
| `POST` | `/speech/text-to-speech` | Generates speech audio from text using Sarvam AI |
| `POST` | `/speech/speech-to-text` | Transcribes spoken audio recording to text |
| `GET` | `/patients` | Retrieves all registered patients with summary stats |
| `GET` | `/patients/{patient_id}` | Retrieves profile details for a specific patient |
| `GET` | `/patients/{patient_id}/snapshot` | Returns full activity log and calculated performance report |
| `GET` | `/patients/{patient_id}/events` | Retrieves all recorded events for a patient |
| `POST` | `/patients/{patient_id}/activity` | Records a cognitive game result for a patient |
| `POST` | `/sync` | Bulk synchronization of offline events for a patient |

---

## 🧪 Testing & Verification

The project includes test scripts to verify backend APIs, voice integration, and database operations:

```bash
# Verify backend endpoints and database
python -c "from backend.main import app; from fastapi.testclient import TestClient; client = TestClient(app); print(client.get('/health').json())"

# Run voice & chat tests
python test_voice_integration.py
python test_all_roles.py

# Verify Frontend build
cd Frontend
npm run build
```

---

## 📄 License & Notes
- Built for Smart India Hackathon (SIH) 2026.
- Disclaimer: CareCue is an assistive care support and cognitive stimulation platform designed to aid individuals, families, and healthcare providers.
