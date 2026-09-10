import os
import sys

# Ensure the backend directory itself is in sys.path for both direct & module execution
_here = os.path.dirname(os.path.abspath(__file__))
if _here not in sys.path:
    sys.path.insert(0, _here)

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import initialize_database
from routes import chat, translation, speech, patients, sync

app = FastAPI(
    title="CareCue & AI Companion API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# CORS configuration allowing local frontend & Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    try:
        initialize_database()
    except Exception as e:
        print(f"Warning: Database initialization error: {e}")


# Core AI & Voice routes (with and without /api prefix for flexibility)
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

app.include_router(translation.router, prefix="/translate", tags=["translation"])
app.include_router(translation.router, prefix="/api/translate", tags=["translation"])

app.include_router(speech.router, prefix="/speech", tags=["speech"])
app.include_router(speech.router, prefix="/api/speech", tags=["speech"])

# Patient, Activity & QR Sync routes
app.include_router(patients.router, prefix="/patients", tags=["patients"])
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])

app.include_router(sync.router, prefix="/sync", tags=["sync"])
app.include_router(sync.router, prefix="/api/sync", tags=["sync"])


@app.get("/")
async def root():
    return {
        "message": "CareCue & SIH AI Companion API is running",
        "status": "ok"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }