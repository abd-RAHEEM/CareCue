import os
from dotenv import load_dotenv
from backend.services.ai_companion_service import AICompanionService

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY not found in environment variables")
    print("Please add GEMINI_API_KEY to your .env file")
    exit(1)

print("Testing Gemini API connection...")

try:
    service = AICompanionService()
    print("PASS: AICompanionService initialized successfully")
    
    # Test basic response
    response = service.generate_response(
        role="patient",
        message="Hello, how are you?",
        patient_context=None,
        language="en-IN"
    )
    
    print(f"PASS: Gemini API response received: {response[:100]}...")
    print("PASS: Gemini API connection test PASSED")
    
except Exception as e:
    print(f"FAIL: Gemini API connection test FAILED: {str(e)}")
    exit(1)
