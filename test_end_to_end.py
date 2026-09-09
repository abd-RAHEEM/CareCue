import sys
import requests
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://127.0.0.1:8000"

print("=== End-to-End Text Flow Test ===\n")

# Demo 1: Patient interaction with context
print("DEMO 1: Patient says 'I am bored' with context")
print("-" * 50)
try:
    response = requests.post(
        f"{BASE_URL}/chat/companion",
        json={
            "patient_id": "P001",
            "role": "patient",
            "message": "I am bored",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"Patient ID: {data['patient_id']}")
        print(f"Role: {data['role']}")
        print(f"Original message: 'I am bored'")
        print(f"AI Response: {data['response']}")
        print(f"Language: {data['language']}")
        print("✓ DEMO 1 PASSED\n")
    else:
        print(f"✗ DEMO 1 FAILED: {response.text}\n")
except Exception as e:
    print(f"✗ DEMO 1 FAILED: {str(e)}\n")

# Demo 2: Caregiver interaction
print("DEMO 2: Caregiver asks for guidance")
print("-" * 50)
try:
    response = requests.post(
        f"{BASE_URL}/chat/companion",
        json={
            "patient_id": "P001",
            "role": "caregiver",
            "message": "How can I help when the patient gets frustrated during a game?",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"Patient ID: {data['patient_id']}")
        print(f"Role: {data['role']}")
        print(f"Caregiver question: 'How can I help when the patient gets frustrated during a game?'")
        print(f"AI Guidance: {data['response'][:200]}...")
        print(f"Language: {data['language']}")
        print("✓ DEMO 2 PASSED\n")
    else:
        print(f"✗ DEMO 2 FAILED: {response.text}\n")
except Exception as e:
    print(f"✗ DEMO 2 FAILED: {str(e)}\n")

# Demo 3: Health worker summary
print("DEMO 3: Health worker requests patient summary")
print("-" * 50)
try:
    response = requests.post(
        f"{BASE_URL}/chat/companion",
        json={
            "patient_id": "P001",
            "role": "health_worker",
            "message": "What should I know about this patient?",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"Patient ID: {data['patient_id']}")
        print(f"Role: {data['role']}")
        print(f"Health worker question: 'What should I know about this patient?'")
        print(f"AI Summary: {data['response'][:200]}...")
        print(f"Language: {data['language']}")
        print("✓ DEMO 3 PASSED\n")
    else:
        print(f"✗ DEMO 3 FAILED: {response.text}\n")
except Exception as e:
    print(f"✗ DEMO 3 FAILED: {str(e)}\n")

# Demo 4: Translation flow
print("DEMO 4: Translation flow (English to Assamese)")
print("-" * 50)
try:
    # First get AI response
    chat_response = requests.post(
        f"{BASE_URL}/chat/companion",
        json={
            "patient_id": "P001",
            "role": "patient",
            "message": "Hello",
            "language": "en-IN"
        }
    )
    
    if chat_response.status_code == 200:
        chat_data = chat_response.json()
        ai_response = chat_data['response']
        print(f"English AI Response: {ai_response[:100]}...")
        
        # Then translate to Assamese
        translate_response = requests.post(
            f"{BASE_URL}/translate",
            json={
                "text": ai_response[:100],
                "source_language": "en-IN",
                "target_language": "as-IN"
            }
        )
        
        if translate_response.status_code == 200:
            translate_data = translate_response.json()
            print(f"Assamese Translation: {translate_data['translated_text']}")
            print("✓ DEMO 4 PASSED\n")
        else:
            print(f"✗ DEMO 4 FAILED (Translation): {translate_response.text}\n")
    else:
        print(f"✗ DEMO 4 FAILED (Chat): {chat_response.text}\n")
except Exception as e:
    print(f"✗ DEMO 4 FAILED: {str(e)}\n")

# Demo 5: TTS flow
print("DEMO 5: Text-to-Speech flow")
print("-" * 50)
try:
    # Get AI response
    chat_response = requests.post(
        f"{BASE_URL}/chat/companion",
        json={
            "patient_id": "P001",
            "role": "patient",
            "message": "Hello",
            "language": "en-IN"
        }
    )
    
    if chat_response.status_code == 200:
        chat_data = chat_response.json()
        ai_response = chat_data['response'][:50]  # Use shorter text for TTS
        print(f"Text for TTS: {ai_response}")
        
        # Convert to speech
        tts_response = requests.post(
            f"{BASE_URL}/speech/text-to-speech",
            json={
                "text": ai_response,
                "language": "hi-IN",
                "speaker": "shubh"
            }
        )
        
        if tts_response.status_code == 200:
            tts_data = tts_response.json()
            print(f"Audio file generated: {tts_data['audio_file']}")
            print("✓ DEMO 5 PASSED\n")
        else:
            print(f"✗ DEMO 5 FAILED (TTS): {tts_response.text}\n")
    else:
        print(f"✗ DEMO 5 FAILED (Chat): {chat_response.text}\n")
except Exception as e:
    print(f"✗ DEMO 5 FAILED: {str(e)}\n")

print("=== End-to-End Flow Tests Completed ===")
