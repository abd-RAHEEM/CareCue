import os
from dotenv import load_dotenv
from sarvamai import SarvamAI
from sarvamai.play import save

load_dotenv()

client = SarvamAI(
    api_subscription_key=os.getenv("SARVAM_API_KEY")
)

response = client.text_to_speech.convert(
    text="नमस्ते, आप कैसे हैं?",
    language_code="hi-IN",
    model="bulbul:v3",
    speaker="shubh"
)

save(response, "test_output.wav")

print("Audio generated successfully!")
print("Saved as test_output.wav")
