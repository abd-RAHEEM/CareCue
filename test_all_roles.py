import os
import sys
from dotenv import load_dotenv
from backend.services.ai_companion_service import AICompanionService
from backend.services.context_service import ContextService

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

load_dotenv()

print("=== Gemini AI Companion Service Tests ===\n")

try:
    service = AICompanionService()
    context_service = ContextService()
    print("PASS: Services initialized successfully\n")
except Exception as e:
    print(f"FAIL: Service initialization failed: {str(e)}")
    exit(1)

# Test 1: Patient chat
print("TEST 1: Patient Role Chat")
try:
    response = service.generate_response(
        role="patient",
        message="I am feeling bored",
        patient_context=None,
        language="en-IN"
    )
    print(f"PASS: Patient response received: {response[:100]}...\n")
except Exception as e:
    print(f"FAIL: Patient chat failed: {str(e)}\n")

# Test 2: Caregiver chat
print("TEST 2: Caregiver Role Chat")
try:
    response = service.generate_response(
        role="caregiver",
        message="How can I help someone who forgets their routine?",
        patient_context=None,
        language="en-IN"
    )
    print(f"PASS: Caregiver response received: {response[:100]}...\n")
except Exception as e:
    print(f"FAIL: Caregiver chat failed: {str(e)}\n")

# Test 3: Health worker chat
print("TEST 3: Health Worker Role Chat")
try:
    response = service.generate_response(
        role="health_worker",
        message="What should I know about this patient?",
        patient_context=None,
        language="en-IN"
    )
    print(f"PASS: Health worker response received: {response[:100]}...\n")
except Exception as e:
    print(f"FAIL: Health worker chat failed: {str(e)}\n")

# Test 4: Patient context personalization
print("TEST 4: Patient Context Personalization")
try:
    patient_context = context_service.get_patient_context("P001")
    response = service.generate_response(
        role="patient",
        message="What can I do today?",
        patient_context=patient_context,
        language="en-IN"
    )
    print(f"PASS: Context-aware response received: {response[:100]}...\n")
except Exception as e:
    print(f"FAIL: Context personalization failed: {str(e)}\n")

print("=== All tests completed ===")
