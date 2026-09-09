from fastapi import APIRouter, HTTPException
from models.chat_models import TranslationRequest, TranslationResponse
from services.sarvam_service import SarvamService

router = APIRouter()

sarvam_service = SarvamService()


@router.post("", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="text cannot be empty")
    if not request.source_language:
        raise HTTPException(status_code=400, detail="source_language is required")
    if not request.target_language:
        raise HTTPException(status_code=400, detail="target_language is required")

    try:
        translated_text = sarvam_service.translate_text(
            text=request.text,
            source_language=request.source_language,
            target_language=request.target_language
        )
        return TranslationResponse(
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
