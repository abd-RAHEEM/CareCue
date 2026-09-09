import os
from dotenv import load_dotenv
from typing import Dict, Any, Optional
from services.reme_service import ReMeService

load_dotenv()


class AICompanionService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
        self.reme_fallback = ReMeService()

        if self.api_key:
            try:
                import google.genai as genai  # google-genai package
                self.client = genai.Client(api_key=self.api_key)
                print("Gemini client initialized successfully.")
            except ImportError:
                print("Warning: google-genai package not installed. Install with: pip install google-genai")
                self.client = None
            except Exception as e:
                print(f"Warning: Could not initialize Gemini client: {e}")
                self.client = None

    def _get_role_prompt(self, role: str) -> str:
        if role == "patient":
            return """You are a friendly, caring, and patient AI companion for an elderly person with cognitive support needs. Your role is to:
- Be warm, encouraging, and supportive
- Use short, simple sentences with kind vocabulary
- Never overwhelm the patient with too much information
- Encourage cognitive games and daily activities
- Respond conversationally and naturally
- Never diagnose dementia or any medical condition
- Never provide medical diagnosis or pretend to be a doctor
- Only use information explicitly provided in the patient context

Your responses should be brief, positive, and encouraging."""

        elif role == "caregiver":
            return """You are an AI assistant for caregivers of elderly patients. Your role is to:
- Provide general caregiving guidance and supportive suggestions
- Explain patient activity patterns based on available context
- Help with reminders and routine management
- Clearly state that guidance is general and not medical advice

Your responses should be practical, supportive, and focused on helping caregivers."""

        elif role == "health_worker":
            return """You are an AI assistant for health workers visiting elderly patients. Your role is to:
- Summarize recent patient activity based on available context
- Summarize game performance and cognitive exercise data
- Provide concise, actionable insights useful during home visits

Keep responses concise, factual, and actionable."""

        return "You are a helpful AI assistant."

    def _format_context(self, patient_context: Optional[Dict[str, Any]]) -> str:
        if not patient_context:
            return "No patient context available."
        parts = []
        for key, label in [("name", "Patient name"), ("preferred_language", "Preferred language")]:
            if key in patient_context:
                parts.append(f"{label}: {patient_context[key]}")
        for key, label in [("family_members", "Family members"), ("interests", "Interests"),
                           ("important_routines", "Important routines"), ("familiar_objects", "Familiar objects")]:
            if patient_context.get(key):
                parts.append(f"{label}: {', '.join(patient_context[key])}")
        if "recent_activity" in patient_context:
            a = patient_context["recent_activity"]
            ap = []
            if "game" in a: ap.append(f"Recent game: {a['game']}")
            if "accuracy" in a: ap.append(f"Accuracy: {a['accuracy']}%")
            if "hints" in a: ap.append(f"Hints used: {a['hints']}")
            if "completion" in a: ap.append(f"Completed: {a['completion']}")
            if ap: parts.append("Recent activity: " + ", ".join(ap))
        return "\n".join(parts) if parts else "No patient context available."

    def generate_response(self, role: str, message: str,
                          patient_context: Optional[Dict[str, Any]] = None,
                          language: str = "en-IN") -> str:
        if not self.client:
            return self.reme_fallback.generate_response(role, message, patient_context, language)
        try:
            prompt = f"""{self._get_role_prompt(role)}

PATIENT CONTEXT:
{self._format_context(patient_context)}

USER MESSAGE:
{message}

Please provide a helpful, appropriate response based on the role and context provided."""

            response = self.client.models.generate_content(model=self.model, contents=prompt)
            text = response.text
            if text:
                return text.strip()
            return self.reme_fallback.generate_response(role, message, patient_context, language)
        except Exception as e:
            print(f"Gemini fallback to ReMe: {e}")
            return self.reme_fallback.generate_response(role, message, patient_context, language)
