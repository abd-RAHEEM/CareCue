import sys
import requests
import os

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://127.0.0.1:8000"

print("=== Speech-to-Text Endpoint Test ===\n")

# Test Speech-to-Text endpoint
print("TEST: POST /speech/speech-to-text")
try:
    audio_file_path = "test_output.wav"
    if not os.path.exists(audio_file_path):
        print(f"FAIL: Audio file not found: {audio_file_path}")
    else:
        with open(audio_file_path, 'rb') as audio_file:
            files = {'audio_file': (audio_file_path, audio_file, 'audio/wav')}
            response = requests.post(
                f"{BASE_URL}/speech/speech-to-text",
                files=files
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"PASS: Speech-to-text successful")
            print(f"Transcript: {data['transcript']}\n")
        else:
            print(f"FAIL: Speech-to-text failed with status {response.status_code}: {response.text}\n")
except Exception as e:
    print(f"FAIL: Speech-to-text request failed: {str(e)}\n")

print("=== Speech-to-Text Test Completed ===")
