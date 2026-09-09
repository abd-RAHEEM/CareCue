from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    patient_id: str = Field(..., description="Patient ID")
    role: str = Field(..., description="Role: patient, caregiver, or health_worker")
    message: str = Field(..., description="User message")
    language: str = Field(..., description="Language code (e.g., en-IN, as-IN, hi-IN)")


class ChatResponse(BaseModel):
    patient_id: str
    role: str
    response: str
    language: str


class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    source_language: str = Field(..., description="Source language code")
    target_language: str = Field(..., description="Target language code")


class TranslationResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str


class TextToSpeechRequest(BaseModel):
    text: str = Field(..., description="Text to convert to speech")
    language: str = Field(..., description="Language code")
    speaker: str = Field(..., description="Speaker name")


class TextToSpeechResponse(BaseModel):
    message: str
    audio_file: str


class SpeechToTextResponse(BaseModel):
    transcript: str
