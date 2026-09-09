import sys
import json
import requests
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://127.0.0.1:8000"

print("=== API Endpoint Tests ===\n")

# Test 1: Translation endpoint
print("TEST 1: POST /translate")
try:
    response = requests.post(
        f"{BASE_URL}/translate",
        json={
            "text": "Hello, how are you?",
            "source_language": "en-IN",
            "target_language": "as-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"PASS: Translation successful")
        print(f"Original: Hello, how are you?")
        print(f"Translated: {data['translated_text']}\n")
    else:
        print(f"FAIL: Translation failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Translation request failed: {str(e)}\n")

# Test 2: Text-to-Speech endpoint
print("TEST 2: POST /speech/text-to-speech")
try:
    response = requests.post(
        f"{BASE_URL}/speech/text-to-speech",
        json={
            "text": "Namaste, how are you?",
            "language": "hi-IN",
            "speaker": "shubh"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"PASS: TTS successful")
        print(f"Audio file: {data['audio_file']}\n")
    else:
        print(f"FAIL: TTS failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: TTS request failed: {str(e)}\n")

# Test 3: Chat endpoint - Patient
print("TEST 3: POST /chat - Patient Role")
try:
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "patient_id": "P001",
            "role": "patient",
            "message": "I am bored",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"PASS: Patient chat successful")
        print(f"Response: {data['response'][:100]}...\n")
    else:
        print(f"FAIL: Patient chat failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Patient chat request failed: {str(e)}\n")

# Test 4: Chat endpoint - Caregiver
print("TEST 4: POST /chat - Caregiver Role")
try:
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "patient_id": "P001",
            "role": "caregiver",
            "message": "How can I help when the patient gets frustrated during a game?",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"PASS: Caregiver chat successful")
        print(f"Response: {data['response'][:100]}...\n")
    else:
        print(f"FAIL: Caregiver chat failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Caregiver chat request failed: {str(e)}\n")

# Test 5: Chat endpoint - Health Worker
print("TEST 5: POST /chat - Health Worker Role")
try:
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "patient_id": "P001",
            "role": "health_worker",
            "message": "What should I know about this patient?",
            "language": "en-IN"
        }
    )
    if response.status_code == 200:
        data = response.json()
        print(f"PASS: Health worker chat successful")
        print(f"Response: {data['response'][:100]}...\n")
    else:
        print(f"FAIL: Health worker chat failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Health worker chat request failed: {str(e)}\n")

# Test 6: Error handling - Invalid role
print("TEST 6: Error Handling - Invalid Role")
try:
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "patient_id": "P001",
            "role": "invalid_role",
            "message": "Hello",
            "language": "en-IN"
        }
    )
    if response.status_code == 400:
        print(f"PASS: Invalid role correctly rejected")
        print(f"Error: {response.json()['detail']}\n")
    else:
        print(f"FAIL: Expected 400 but got {response.status_code}\n")
except Exception as e:
    print(f"FAIL: Error handling test failed: {str(e)}\n")

# Test 7: Error handling - Empty message
print("TEST 7: Error Handling - Empty Message")
try:
    response = requests.post(
        f"{BASE_URL}/chat",
        json={
            "patient_id": "P001",
            "role": "patient",
            "message": "",
            "language": "en-IN"
        }
    )
    if response.status_code == 400:
        print(f"PASS: Empty message correctly rejected")
        print(f"Error: {response.json()['detail']}\n")
    else:
        print(f"FAIL: Expected 400 but got {response.status_code}\n")
except Exception as e:
    print(f"FAIL: Error handling test failed: {str(e)}\n")

# Test 8: Companion endpoint (alias for chat)
print("TEST 8: POST /chat/companion - Patient Role")
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
        print(f"PASS: Companion endpoint successful")
        print(f"Response: {data['response'][:100]}...\n")
    else:
        print(f"FAIL: Companion endpoint failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Companion endpoint request failed: {str(e)}\n")

print("=== API Endpoint Tests Completed ===")
