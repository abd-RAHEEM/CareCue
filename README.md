# CareCue (SIH AI Companion)

CareCue is an offline-first, voice-first cognitive care platform and AI companion designed for older adults, individuals living with dementia/mild cognitive impairment, caregivers, and community health workers in India (with special focus on regional languages such as Assamese and Hindi).

This repository contains both the **Frontend Web Application** (React 19 + TypeScript + Vite + Zustand + Tailwind CSS) and the **Backend API Service** (FastAPI + Sarvam AI + Speech STT/TTS + Multi-role LLM companion).

---

## 🌟 Highlights & Features

### Frontend Experience
- **Three Dedicated Role Views**:
  - **Patient**: Home dashboard, daily routines, reminders, conversational companion, memory & family gallery, and 15 interactive cognitive games.
  - **Caregiver**: Real-time supervision dashboard, interactive memory graph builder, routine/medication scheduler, cognitive progression profiles, and family/community support.
  - **Health Worker**: Community patient cohort list, clinical summary profiles, observation notes, and exportable reports.
- **15 Cognitive Games**: Memory Basket, My Memory Box, Recipe Recall, Sound Detective, Simon Says, Weaving Tracker, Pattern Builder, Daily Life Sequencer, Festival Memory, Object Detective, Familiar Pattern Match, Landmark Puzzle, Story Circle, Music Rhythm, and Family Music.
- **Cultural & Regional Localization**: Built-in content packs for English and Assamese (`src/content-packs/`).
- **Flexible Modes**: Toggle between instant standalone offline mock mode (Zustand-backed) and real FastAPI backend integration via simple `.env.local` config.

### Backend & AI Capabilities
- **Multi-Role Conversational AI Companion**: Role-tailored prompts for Patients, Caregivers, and Health Workers with patient context awareness.
- **Voice & Speech AI (Sarvam AI Integration)**:
  - Text-to-Speech (TTS) with regional voice output (`/speech/text-to-speech`) + browser speech synthesis fallback.
  - Speech-to-Text (STT) voice input (`/speech/speech-to-text`) via web audio recording.
  - Regional language translation (`/translate`) for Indic languages (Assamese `as-IN`, Hindi `hi-IN`, English `en-IN`).
- **Context Management**: Patient memory graph, recent activity tracking, and adaptive response generation.

---

## 🏗️ Project Architecture & Structure

```text
CareCue/
├── Frontend/                          # React + TypeScript + Vite Frontend
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── api/                       # API integration layer (speech, assistant, activities, etc.)
│   │   ├── components/                # Reusable UI components
│   │   ├── content-packs/             # Regional cultural data packs (English, Assamese)
│   │   ├── games/                     # 15 Cognitive game modules
│   │   ├── roles/                     # Role-based pages (patient, caregiver, healthworker)
│   │   ├── store/                     # Zustand central state management
│   │   ├── App.tsx                    # Main router & app shell
│   │   ├── main.tsx
│   │   └── types.ts                   # Unified TypeScript data contracts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                           # FastAPI Python Backend
│   ├── models/                        # Pydantic data schemas & request models
│   ├── prompts/                       # Role-specific system prompts (patient, caregiver, health_worker)
│   ├── routes/                        # API route handlers (chat, speech, translation)
│   ├── services/                      # Sarvam AI, AI companion, context, and ReMe services
│   ├── generated_audio/               # Temporary generated audio storage (gitignored)
│   └── main.py                        # FastAPI application entry point
│
├── DESIGN.md                          # Comprehensive design system & architecture docs
├── requirements.txt                   # Python backend dependencies
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
# Create a .env file in the repository root:
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
# In Frontend/.env.local (or create from .env.example):
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

---

## 🧪 Testing

The backend includes test scripts to verify integrations:
```bash
python test_api_endpoints.py
python test_voice_integration.py
python test_all_roles.py
```

Frontend build check:
```bash
cd Frontend
npm run build
```

---

## 📄 License & Notes
- Built for Smart India Hackathon (SIH) 2026.
- Prototype disclaimer: Designed for assistive care support and cognitive stimulation.
