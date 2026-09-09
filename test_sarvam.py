import os
from dotenv import load_dotenv
from backend.services.sarvam_service import SarvamService

load_dotenv()

print("=== Sarvam Services Tests ===\n")

try:
    sarvam_service = SarvamService()
    print("PASS: SarvamService initialized successfully\n")
except Exception as e:
    print(f"FAIL: SarvamService initialization failed: {str(e)}")
    exit(1)

# Test 1: Translation
print("TEST 1: Sarvam Translation")
try:
    translated = sarvam_service.translate_text(
        text="Hello, how are you?",
        source_language="en-IN",
        target_language="as-IN"
    )
    print(f"PASS: Translation successful (length: {len(translated)} chars)\n")
except Exception as e:
    print(f"FAIL: Translation failed: {str(e)}\n")

# Test 2: Text-to-Speech
print("TEST 2: Sarvam Text-to-Speech")
try:
    audio_file = sarvam_service.text_to_speech(
        text="Namaste, how are you?",
        language="hi-IN",
        speaker="shubh"
    )
    print(f"PASS: TTS successful, audio file: {audio_file}\n")
except Exception as e:
    print(f"FAIL: TTS failed: {str(e)}\n")

print("=== Sarvam tests completed ===")
