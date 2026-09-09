import requests

url = "http://127.0.0.1:8000/speech/speech-to-text"
file_path = "C:\\Users\\OneDrive\\Desktop\\sih-ai-companion\\backend\\generated_audio\\41252ecc-f62a-488a-a693-6f47325d6ed4.wav"

with open(file_path, 'rb') as f:
    files = {'audio_file': f}
    response = requests.post(url, files=files)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")
