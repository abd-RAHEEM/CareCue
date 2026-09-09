import sys
import requests
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://127.0.0.1:8000"

print("=== End-to-End Text Flow Test (Limited API Usage) ===\n")

# Demo 1: Translation flow (independent of Gemini)
print("DEMO 1: Translation flow (English to Assamese)")
print("-" * 50)
try:
    translate_response = requests.post(
        f"{BASE_URL}/translate",
        json={
            "text": "Hello, how are you today?",
            "source_language": "en-IN",
            "target_language": "as-IN"
        }
    )
    
    if translate_response.status_code == 200:
        translate_data = translate_response.json()
        print(f"English: Hello, how are you today?")
        print(f"Assamese: {translate_data['translated_text']}")
        print("✓ DEMO 1 PASSED\n")
    else:
        print(f"✗ DEMO 1 FAILED: {translate_response.text}\n")
except Exception as e:
    print(f"✗ DEMO 1 FAILED: {str(e)}\n")

# Demo 2: TTS flow (independent of Gemini)
print("DEMO 2: Text-to-Speech flow")
print("-" * 50)
try:
    tts_response = requests.post(
        f"{BASE_URL}/speech/text-to-speech",
        json={
            "text": "Hello, how are you?",
            "language": "hi-IN",
            "speaker": "shubh"
        }
    )
    
    if tts_response.status_code == 200:
        tts_data = tts_response.json()
        print(f"Text: Hello, how are you?")
        print(f"Audio file generated: {tts_data['audio_file']}")
        print("✓ DEMO 2 PASSED\n")
    else:
        print(f"✗ DEMO 2 FAILED: {tts_response.text}\n")
except Exception as e:
    print(f"✗ DEMO 2 FAILED: {str(e)}\n")

# Demo 3: STT flow (independent of Gemini)
print("DEMO 3: Speech-to-Text flow")
print("-" * 50)
try:
    audio_file_path = "test_output.wav"
    if os.path.exists(audio_file_path):
        with open(audio_file_path, 'rb') as audio_file:
            files = {'audio_file': (audio_file_path, audio_file, 'audio/wav')}
            stt_response = requests.post(
                f"{BASE_URL}/speech/speech-to-text",
                files=files
            )
        
        if stt_response.status_code == 200:
            stt_data = stt_response.json()
            print(f"Audio file: {audio_file_path}")
            print(f"Transcript: {stt_data['transcript']}")
            print("✓ DEMO 3 PASSED\n")
        else:
            print(f"✗ DEMO 3 FAILED: {stt_response.text}\n")
    else:
        print(f"✗ DEMO 3 FAILED: Audio file not found\n")
except Exception as e:
    print(f"✗ DEMO 3 FAILED: {str(e)}\n")

# Demo 4: Combined flow (Translation + TTS)
print("DEMO 4: Combined Translation + TTS flow")
print("-" * 50)
try:
    # First translate
    translate_response = requests.post(
        f"{BASE_URL}/translate",
        json={
            "text": "Would you like to play a game?",
            "source_language": "en-IN",
            "target_language": "as-IN"
        }
    )
    
    if translate_response.status_code == 200:
        translate_data = translate_response.json()
        translated_text = translate_data['translated_text']
        print(f"English: Would you like to play a game?")
        print(f"Assamese: {translated_text}")
        
        # Then convert to speech (using Hindi as Assamese TTS may not be supported)
        tts_response = requests.post(
            f"{BASE_URL}/speech/text-to-speech",
            json={
                "text": translated_text,
                "language": "hi-IN",  # Using Hindi as fallback for TTS
                "speaker": "shubh"
            }
        )
        
        if tts_response.status_code == 200:
            tts_data = tts_response.json()
            print(f"Audio file generated: {tts_data['audio_file']}")
            print("✓ DEMO 4 PASSED\n")
        else:
            print(f"✗ DEMO 4 FAILED (TTS): {tts_response.text}\n")
    else:
        print(f"✗ DEMO 4 FAILED (Translation): {translate_response.text}\n")
except Exception as e:
    print(f"✗ DEMO 4 FAILED: {str(e)}\n")

print("=== End-to-End Flow Tests Completed ===")
print("\nNOTE: Gemini API quota limit reached (20 requests/day for free tier).")
print("Patient/Caregiver/Health Worker chat tests would require additional quota.")
