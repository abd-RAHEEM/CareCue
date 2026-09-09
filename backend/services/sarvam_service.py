from dotenv import load_dotenv
load_dotenv()

import os
from sarvamai import SarvamAI
from sarvamai.play import save
from typing import Optional


class SarvamService:
    def __init__(self):
        api_key = os.getenv("SARVAM_API_KEY")
        if not api_key:
            raise ValueError("SARVAM_API_KEY not found in environment variables")
        self.client = SarvamAI(api_subscription_key=api_key)

    def translate_text(
        self,
        text: str,
        source_language: str,
        target_language: str,
        model: str = "sarvam-translate:v1"
    ) -> str:
        try:
            response = self.client.text.translate(
                input=text,
                source_language_code=source_language,
                target_language_code=target_language,
                model=model
            )
            return response.translated_text
        except Exception as e:
            raise Exception(f"Translation failed: {str(e)}")

    def text_to_speech(
        self,
        text: str,
        language: str,
        speaker: str,
        model: str = "bulbul:v3",
        output_dir: str = "backend/generated_audio"
    ) -> str:
        try:
            response = self.client.text_to_speech.convert(
                text=text,
                language_code=language,
                model=model,
                speaker=speaker
            )
            
            os.makedirs(output_dir, exist_ok=True)
            
            import uuid
            filename = f"{uuid.uuid4()}.wav"
            output_path = os.path.join(output_dir, filename)
            
            save(response, output_path)
            
            return filename
        except Exception as e:
            raise Exception(f"Text-to-speech failed: {str(e)}")

    def speech_to_text(
        self,
        audio_file,
        model: str = "saaras:v3"
    ) -> str:
        try:
            response = self.client.speech_to_text.transcribe(
                file=audio_file,
                model=model
            )
            return response.transcript
        except Exception as e:
            raise Exception(f"Speech-to-text failed: {str(e)}")
