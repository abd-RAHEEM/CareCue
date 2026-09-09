from fastapi import APIRouter, HTTPException

try:
    from backend.models.chat_models import ChatRequest, ChatResponse
    from backend.services.ai_companion_service import AICompanionService
    from backend.services.context_service import ContextService
except ImportError:
    from models.chat_models import ChatRequest, ChatResponse
    from services.ai_companion_service import AICompanionService
    from services.context_service import ContextService

router = APIRouter()

ai_companion_service = AICompanionService()
context_service = ContextService()


async def _process_chat_request(request: ChatRequest):
    valid_roles = ["patient", "caregiver", "health_worker"]
    if request.role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {valid_roles}")

    if not request.patient_id:
        raise HTTPException(status_code=400, detail="patient_id is required")

    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")

    patient_context = context_service.get_patient_context(request.patient_id)

    try:
        response = ai_companion_service.generate_response(
            role=request.role,
            message=request.message,
            patient_context=patient_context,
            language=request.language
        )

        return ChatResponse(
            patient_id=request.patient_id,
            role=request.role,
            response=response,
            language=request.language
        )
    except Exception as e:
        error_str = str(e)
        # Check if it's a quota error (429)
        if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
            raise HTTPException(status_code=429, detail="Gemini API quota exceeded. Please try again later or upgrade to a paid plan.")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return await _process_chat_request(request)


@router.post("/companion", response_model=ChatResponse)
async def companion(request: ChatRequest):
    return await _process_chat_request(request)
