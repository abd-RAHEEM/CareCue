from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from backend.routes import chat, translation, speech

app = FastAPI(title="SIH AI Companion API", version="1.0.0", docs_url="/docs", openapi_url="/openapi.json")

# Allow CORS for localhost, preview URLs, and all production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Support both root prefixes and /api/* prefixes
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])

app.include_router(translation.router, prefix="/translate", tags=["translation"])
app.include_router(translation.router, prefix="/api/translate", tags=["translation"])

app.include_router(speech.router, prefix="/speech", tags=["speech"])
app.include_router(speech.router, prefix="/api/speech", tags=["speech"])


@app.get("/api")
@app.get("/api/")
async def api_root():
    return {
        "message": "SIH AI Companion API is running",
        "status": "ok"
    }


@app.get("/health")
@app.get("/api/health")
async def health():
    return {
        "status": "healthy"
    }


# ── Frontend SPA static files fallback ─────────────────────────────────────────
# Locate Frontend/dist from backend or serverless root
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_dir = os.path.join(base_dir, "Frontend", "dist")

if not os.path.exists(dist_dir):
    dist_dir = os.path.join(base_dir, "dist")

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_root():
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "SIH AI Companion API is running", "status": "ok"}

    @app.get("/{full_path:path}")
    async def serve_spa_routes(full_path: str):
        # First check if the requested static file exists in dist (e.g. favicon.svg)
        target_file = os.path.join(dist_dir, full_path)
        if os.path.exists(target_file) and os.path.isfile(target_file):
            return FileResponse(target_file)
        
        # Fall back to index.html for React client-side routing
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"detail": "Not Found"}
else:
    @app.get("/")
    async def fallback_root():
        return {
            "message": "SIH AI Companion API is running",
            "status": "ok"
        }
