import os
from dotenv import load_dotenv
from typing import Dict, Any, Optional

try:
    from backend.services.reme_service import ReMeService
except ImportError:
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
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
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
- Never diagnose the patient or provide medical prescriptions

Your responses should be practical, supportive, and focused on helping caregivers."""

        elif role == "health_worker":
            return """You are an AI assistant for health workers visiting elderly patients. Your role is to:
- Summarize recent patient activity based on available context
- Summarize game performance and cognitive exercise data
- Mention missed reminders or adherence issues
- Provide concise, actionable insights useful during home visits

Keep responses concise, factual, and actionable."""

        else:
            return "You are a helpful AI assistant."

    def _format_context(self, patient_context: Optional[Dict[str, Any]]) -> str:
        if not patient_context:
            return "No patient context available."
        
        context_parts = []
        if "name" in patient_context:
            context_parts.append(f"Patient name: {patient_context['name']}")
        if "preferred_language" in patient_context:
            context_parts.append(f"Preferred language: {patient_context['preferred_language']}")
        if "family_members" in patient_context and patient_context["family_members"]:
            context_parts.append(f"Family members: {', '.join(patient_context['family_members'])}")
        if "interests" in patient_context and patient_context["interests"]:
            context_parts.append(f"Interests: {', '.join(patient_context['interests'])}")
        if "important_routines" in patient_context and patient_context["important_routines"]:
            context_parts.append(f"Important routines: {', '.join(patient_context['important_routines'])}")
        if "familiar_objects" in patient_context and patient_context["familiar_objects"]:
            context_parts.append(f"Familiar objects: {', '.join(patient_context['familiar_objects'])}")
        
        if "recent_activity" in patient_context:
            activity = patient_context["recent_activity"]
            activity_parts = []
            if "game" in activity:
                activity_parts.append(f"Recent game: {activity['game']}")
            if "accuracy" in activity:
                activity_parts.append(f"Accuracy: {activity['accuracy']}%")
            if "hints" in activity:
                activity_parts.append(f"Hints used: {activity['hints']}")
            if "completion" in activity:
                activity_parts.append(f"Completed: {activity['completion']}")
            if activity_parts:
                context_parts.append("Recent activity: " + ", ".join(activity_parts))
        
        return "\n".join(context_parts) if context_parts else "No patient context available."

    def generate_response(
        self,
        role: str,
        message: str,
        patient_context: Optional[Dict[str, Any]] = None,
        language: str = "en-IN"
    ) -> str:
        # If Gemini client is not initialized or no API key, use fallback
        if not self.client:
            return self.reme_fallback.generate_response(role, message, patient_context, language)

        try:
            system_prompt = self._get_role_prompt(role)
            context_str = self._format_context(patient_context)
            full_prompt = f"""{system_prompt}

PATIENT CONTEXT:
{context_str}

USER MESSAGE:
{message}

Please provide a helpful, appropriate response based on the role and context provided."""

            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt
            )
            
            response_text = response.text
            if response_text:
                return response_text.strip()
            
            return self.reme_fallback.generate_response(role, message, patient_context, language)

        except Exception as e:
            print(f"Gemini API call error (falling back to ReMe): {e}")
            return self.reme_fallback.generate_response(role, message, patient_context, language)
