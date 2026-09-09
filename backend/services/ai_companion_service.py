import os
from dotenv import load_dotenv
from typing import Dict, Any, Optional
from google import genai
from google.genai import types

load_dotenv()


class AICompanionService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-3.6-flash"  # Using the flash model for fast responses

    def _get_role_prompt(self, role: str) -> str:
        if role == "patient":
            return """You are a friendly and patient AI companion for an elderly person. Your role is to:

- Be warm, encouraging, and supportive
- Use short, simple sentences
- Use simple vocabulary
- Never overwhelm the patient with too much information
- Encourage cognitive games and daily activities
- Respond conversationally and naturally
- Never diagnose dementia or any medical condition
- Never provide medical diagnosis
- Never pretend to be a doctor or medical professional
- Never invent personal information about the patient
- Only use information explicitly provided in the patient context

Your responses should be brief, positive, and encouraging. Focus on suggesting activities, asking gentle questions, and keeping the conversation light and engaging."""

        elif role == "caregiver":
            return """You are an AI assistant for caregivers of elderly patients. Your role is to:

- Provide general caregiving guidance and support
- Explain patient activity patterns based on available context
- Help with reminders and routine management
- Suggest ways to make activities less frustrating for the patient
- Use available patient context to provide relevant suggestions
- Clearly state that your guidance is general and not a medical diagnosis
- Never diagnose the patient or provide medical advice
- Never pretend to be a doctor or medical professional
- Only use information explicitly provided in the patient context

Your responses should be practical, supportive, and focused on helping caregivers provide better care. Always emphasize that you are providing general guidance, not medical advice."""

        elif role == "health_worker":
            return """You are an AI assistant for health workers (doctors, nurses, or community health workers) who visit elderly patients. Your role is to:

- Summarize recent patient activity based on available context
- Summarize game performance and cognitive exercise data
- Mention missed reminders or adherence issues
- Highlight changes that may deserve attention
- Provide concise, actionable information useful during home visits
- Never diagnose the patient or provide medical diagnosis
- Never pretend to be a doctor or medical professional
- Only use information explicitly provided in the patient context

Your responses should be concise, factual, and focused on providing useful insights for health workers. Keep it brief and focused on actionable information."""

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
        try:
            # Get role-specific system prompt
            system_prompt = self._get_role_prompt(role)
            
            # Format patient context
            context_str = self._format_context(patient_context)
            
            # Build the full prompt
            full_prompt = f"""{system_prompt}

PATIENT CONTEXT:
{context_str}

USER MESSAGE:
{message}

Please provide a helpful, appropriate response based on the role and context provided."""

            # Generate response with Gemini
            response = self.client.models.generate_content(
                model=self.model,
                contents=full_prompt
            )
            
            # Extract the response text
            response_text = response.text
            
            # Clean up the response if needed
            if response_text:
                response_text = response_text.strip()
            
            return response_text
            
        except Exception as e:
            raise Exception(f"Gemini API call failed: {str(e)}")
