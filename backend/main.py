import sys
import os

# Ensure the backend directory itself is in sys.path for relative imports
_here = os.path.dirname(os.path.abspath(__file__))
if _here not in sys.path:
    sys.path.insert(0, _here)

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import chat, translation, speech

app = FastAPI(
    title="SIH AI Companion API",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

# Allow CORS for all origins (frontend on Vercel, local dev, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(translation.router, prefix="/translate", tags=["translation"])
app.include_router(speech.router, prefix="/speech", tags=["speech"])


@app.get("/")
async def root():
    return {
        "message": "SIH AI Companion API is running",
        "status": "ok"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }
