from typing import Dict, Any, Optional


class ContextService:
    def __init__(self):
        self._mock_context: Dict[str, Dict[str, Any]] = {
            "P001": {
                "patient_id": "P001",
                "name": "Test Patient",
                "preferred_language": "as-IN",
                "family_members": [
                    "Son",
                    "Daughter"
                ],
                "familiar_objects": [
                    "tea leaves",
                    "bamboo basket",
                    "gamusa"
                ],
                "recent_activity": {
                    "game": "Memory Basket",
                    "accuracy": 80,
                    "hints": 1,
                    "completion": True
                }
            },
            "patient-1": {
                "patient_id": "patient-1",
                "name": "Anima Devi",
                "preferred_language": "as-IN",
                "family_members": [
                    "Rahul (Son)",
                    "Priya (Daughter)"
                ],
                "interests": [
                    "Gardening",
                    "Devotional songs"
                ],
                "important_routines": [
                    "Daughter Priya usually calls at 7 PM"
                ],
                "familiar_objects": [
                    "Medicine Box",
                    "Reading Glasses",
                    "Prayer Book",
                    "Walking Stick",
                    "Gardening tools"
                ],
                "recent_activity": {
                    "game": "Memory Basket",
                    "accuracy": 75,
                    "hints": 1,
                    "completion": True
                }
            },
            "patient-2": {
                "patient_id": "patient-2",
                "name": "Hemanta Bora",
                "preferred_language": "en-IN",
                "family_members": [
                    "Dipali Bora (Wife)",
                    "Nilufar (Daughter)"
                ],
                "familiar_objects": [
                    "Walking Stick",
                    "Medicine Box"
                ],
                "recent_activity": {
                    "game": "No recent activity",
                    "accuracy": 0,
                    "hints": 0,
                    "completion": False
                }
            }
        }

    def get_patient_context(self, patient_id: str) -> Optional[Dict[str, Any]]:
        if patient_id in self._mock_context:
            return self._mock_context[patient_id]
        return None

    def add_patient_context(self, patient_id: str, context: Dict[str, Any]) -> None:
        self._mock_context[patient_id] = context
