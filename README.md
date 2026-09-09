# SIH AI Companion Backend

AI-based cognitive gaming and memory assistance platform backend for elderly dementia patients in the North-Eastern Region (NER) of India.

## Features

- Chat API with role-based AI behavior (patient, caregiver, health_worker)
- Sarvam AI integration for translation, text-to-speech, and speech-to-text
- Regional language support (Assamese, Hindi, etc.)
- Patient context management
- ReMe service abstraction (ready for future integration)

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Install Requirements

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```
SARVAM_API_KEY=your_sarvam_api_key_here
```

**Important:** Never commit the `.env` file or expose API keys.

## Running the Server

Start the FastAPI server:

```bash
uvicorn backend.main:app --reload
```

The server will start at `http://127.0.0.1:8000`

## API Documentation

Once the server is running, access the interactive API documentation at:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Endpoints

### Health Check

**GET /**

Response:
```json
{
  "message": "SIH AI Companion API is running",
  "status": "ok"
}
```

**GET /health**

Response:
```json
{
  "status": "healthy"
}
```

### Chat API

**POST /chat**

Request:
```json
{
  "patient_id": "P001",
  "role": "patient",
  "message": "I am feeling bored",
  "language": "en-IN"
}
```

Supported roles: `patient`, `caregiver`, `health_worker`

Response:
```json
{
  "patient_id": "P001",
  "role": "patient",
  "response": "Would you like to play a small memory game with me?",
  "language": "en-IN"
}
```

### Translation API

**POST /translate**

Request:
```json
{
  "text": "Hello, how are you?",
  "source_language": "en-IN",
  "target_language": "as-IN"
}
```

Response:
```json
{
  "translated_text": "...",
  "source_language": "en-IN",
  "target_language": "as-IN"
}
```

### Text-to-Speech API

**POST /speech/text-to-speech**

Request:
```json
{
  "text": "Namaste, how are you?",
  "language": "hi-IN",
  "speaker": "shubh"
}
```

Response:
```json
{
  "message": "Audio generated successfully",
  "audio_file": "..."
}
```

The audio file is saved in `backend/generated_audio/`

### Speech-to-Text API

**POST /speech/speech-to-text**

Upload an audio file using form data.

Response:
```json
{
  "transcript": "..."
}
```

## Project Structure

```
sih-ai-companion/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── models/
│   │   ├── __init__.py
│   │   └── chat_models.py      # Pydantic models
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── chat.py             # Chat endpoints
│   │   ├── translation.py      # Translation endpoints
│   │   └── speech.py           # TTS/STT endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── sarvam_service.py   # Sarvam AI integration
│   │   ├── reme_service.py     # ReMe service abstraction
│   │   └── context_service.py  # Patient context management
│   ├── prompts/
│   │   ├── patient.txt         # Patient behavior prompt
│   │   ├── caregiver.txt       # Caregiver behavior prompt
│   │   └── health_worker.txt   # Health worker behavior prompt
│   └── generated_audio/        # Generated audio files (gitignored)
├── .env                         # Environment variables (gitignored)
├── .gitignore
├── requirements.txt
└── README.md
```

## Notes

- This is an MVP for Smart India Hackathon 2026
- ReMe integration is currently using a mock implementation
- Patient context is currently in-memory (will be replaced with database)
- Regional language support focuses on North-Eastern Indian languages
