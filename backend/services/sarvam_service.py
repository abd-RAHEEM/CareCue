from dotenv import load_dotenv
load_dotenv()

import os
import tempfile
from typing import Optional

DEFAULT_AUDIO_DIR = os.getenv("AUDIO_DIR", os.path.join(tempfile.gettempdir(), "carecue_audio"))


class SarvamService:
    def __init__(self):
        self.api_key = os.getenv("SARVAM_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from sarvamai import SarvamAI
                self.client = SarvamAI(api_subscription_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize SarvamAI client: {e}")
                self.client = None

    def _ensure_client(self):
        if not self.client:
            self.api_key = os.getenv("SARVAM_API_KEY")
            if not self.api_key:
                raise ValueError("SARVAM_API_KEY is not set. Please configure SARVAM_API_KEY in environment variables.")
            from sarvamai import SarvamAI
            self.client = SarvamAI(api_subscription_key=self.api_key)

    def translate_text(
        self,
        text: str,
        source_language: str,
        target_language: str,
        model: str = "sarvam-translate:v1"
    ) -> str:
        self._ensure_client()
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
        output_dir: Optional[str] = None
    ) -> str:
        self._ensure_client()
        try:
            from sarvamai.play import save
            response = self.client.text_to_speech.convert(
                text=text,
                language_code=language,
                model=model,
                speaker=speaker
            )
            
            target_dir = output_dir or DEFAULT_AUDIO_DIR
            os.makedirs(target_dir, exist_ok=True)
            
            import uuid
            filename = f"{uuid.uuid4()}.wav"
            output_path = os.path.join(target_dir, filename)
            
            save(response, output_path)
            
            return filename
        except Exception as e:
            raise Exception(f"Text-to-speech failed: {str(e)}")

    def speech_to_text(
        self,
        audio_file,
        model: str = "saaras:v3"
    ) -> str:
        self._ensure_client()
        try:
            response = self.client.speech_to_text.transcribe(
                file=audio_file,
                model=model
            )
            return response.transcript
        except Exception as e:
            raise Exception(f"Speech-to-text failed: {str(e)}")
