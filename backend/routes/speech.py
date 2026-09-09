from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse

try:
    from backend.models.chat_models import TextToSpeechRequest, TextToSpeechResponse, SpeechToTextResponse
    from backend.services.sarvam_service import SarvamService, DEFAULT_AUDIO_DIR
except ImportError:
    from models.chat_models import TextToSpeechRequest, TextToSpeechResponse, SpeechToTextResponse
    from services.sarvam_service import SarvamService, DEFAULT_AUDIO_DIR

import os

router = APIRouter()

try:
    sarvam_service = SarvamService()
except Exception as e:
    sarvam_service = None

AUDIO_DIR = DEFAULT_AUDIO_DIR
os.makedirs(AUDIO_DIR, exist_ok=True)


@router.post("/text-to-speech", response_model=TextToSpeechResponse)
async def text_to_speech(request: TextToSpeechRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")

    if not request.language:
        raise HTTPException(status_code=400, detail="language is required")

    if not request.speaker:
        raise HTTPException(status_code=400, detail="speaker is required")

    global sarvam_service
    if sarvam_service is None:
        try:
            sarvam_service = SarvamService()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Sarvam service unavailable: {str(e)}")

    try:
        audio_file = sarvam_service.text_to_speech(
            text=request.text,
            language=request.language,
            speaker=request.speaker,
            output_dir=AUDIO_DIR
        )

        return TextToSpeechResponse(
            message="Audio generated successfully",
            audio_file=audio_file
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")


@router.post("/speech-to-text", response_model=SpeechToTextResponse)
async def speech_to_text(audio_file: UploadFile = File(...)):
    if not audio_file:
        raise HTTPException(status_code=400, detail="audio_file is required")

    if not audio_file.filename:
        raise HTTPException(status_code=400, detail="audio_file must have a filename")

    global sarvam_service
    if sarvam_service is None:
        try:
            sarvam_service = SarvamService()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Sarvam service unavailable: {str(e)}")

    try:
        transcript = sarvam_service.speech_to_text(audio_file.file)

        return SpeechToTextResponse(
            transcript=transcript
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech-to-text failed: {str(e)}")


@router.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Serve generated audio files"""
    file_path = os.path.join(AUDIO_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        file_path,
        media_type="audio/wav",
        filename=filename
    )
