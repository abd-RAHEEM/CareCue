from typing import Dict, Any, Optional
import os


class ReMeService:
    def __init__(self):
        self.api_key = os.getenv("REME_API_KEY")
        self._is_mock = True

    def generate_response(
        self,
        role: str,
        message: str,
        patient_context: Optional[Dict[str, Any]] = None,
        language: str = "en-IN"
    ) -> str:
        if self._is_mock:
            return self._mock_generate_response(role, message, patient_context, language)
        else:
            return self._real_generate_response(role, message, patient_context, language)

    def _mock_generate_response(
        self,
        role: str,
        message: str,
        patient_context: Optional[Dict[str, Any]] = None,
        language: str = "en-IN"
    ) -> str:
        if role == "patient":
            if "bored" in message.lower():
                return "Would you like to play a small memory game with me?"
            elif "tired" in message.lower():
                return "That's okay. Would you like to rest for a while or listen to some music?"
            else:
                return "I'm here to help. What would you like to do today?"
        elif role == "caregiver":
            if patient_context and "recent_activity" in patient_context:
                activity = patient_context["recent_activity"]
                return f"Based on recent activity, the patient completed {activity.get('game', 'a game')} with {activity.get('accuracy', 0)}% accuracy. This is general guidance for caregiving support."
            else:
                return "I can help you with caregiving guidance. Please share any specific concerns or questions."
        elif role == "health_worker":
            if patient_context and "recent_activity" in patient_context:
                activity = patient_context["recent_activity"]
                return f"Patient recent activity: {activity.get('game', 'no game')} completed with {activity.get('accuracy', 0)}% accuracy. Used {activity.get('hints', 0)} hints. Completion: {activity.get('completion', False)}."
            else:
                return "No recent activity data available for this patient."
        else:
            return "I'm not sure how to help with that request."

    def _real_generate_response(
        self,
        role: str,
        message: str,
        patient_context: Optional[Dict[str, Any]] = None,
        language: str = "en-IN"
    ) -> str:
        pass
