from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.routes import chat, translation, speech

app = FastAPI(title="SIH AI Companion API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
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
