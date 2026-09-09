from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.routes import chat, translation, speech

app = FastAPI(title="SIH AI Companion API", version="1.0.0")

# Allow CORS for localhost, preview URLs, and any production domains
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
