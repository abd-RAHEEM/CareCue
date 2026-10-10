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

## 📸 Application Screenshots

<details>
<summary>Click here to view all application screenshots</summary>

<img width="1919" height="903" alt="image" src="https://github.com/user-attachments/assets/fc2a8dbc-fd01-49c6-8cdd-074b2b6f45ef" />
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/6169385e-90d3-4beb-9d7a-c5fee00213c1" />
<img width="1920" height="903" alt="image" src="https://github.com/user-attachments/assets/34fe5396-1e7b-4e82-a175-2a7d6247d7db" />
<img width="1918" height="847" alt="image" src="https://github.com/user-attachments/assets/b96268c2-6b36-4403-a3d5-4dfc5f7ae95f" />
<img width="1916" height="904" alt="image" src="https://github.com/user-attachments/assets/60841a52-c1b5-48a8-a57a-d795bc333454" />
<img width="1920" height="899" alt="image" src="https://github.com/user-attachments/assets/fa2ae933-4656-4b46-9c66-b425b7be7790" />
<img width="1920" height="900" alt="image" src="https://github.com/user-attachments/assets/0801f519-988e-4e4a-9c1d-9f8c584418c0" />
<img width="1919" height="882" alt="image" src="https://github.com/user-attachments/assets/e9bf027a-a311-4a2d-a348-5fc3baa5d1c6" />
<img width="1915" height="855" alt="image" src="https://github.com/user-attachments/assets/c245221e-a1bc-4b86-b497-9c1a5be279fe" />
<img width="1920" height="891" alt="image" src="https://github.com/user-attachments/assets/af9cf953-484b-48d7-abfb-0202cf81fb82" />



</details>


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
- Disclaimer: CareCue is an assistive care support and cognitive stimulation platform designed to aid individuals, families, and healthcare providers.
