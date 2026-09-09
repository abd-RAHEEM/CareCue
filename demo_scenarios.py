"""
Final Demo Test Scenarios for SIH AI Companion Backend

This script demonstrates the three key demo scenarios as specified in the requirements.
Note: Gemini API has a free tier limit of 20 requests/day. If quota is exceeded,
the patient/caregiver/health worker chat tests will fail with 429 errors.

Run this after the quota resets (approximately 48 hours from last usage) or upgrade
to a paid Gemini API plan for unlimited requests.
"""

import sys
import requests
import os
import time

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

BASE_URL = "http://127.0.0.1:8000"

def print_header(title):
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60 + "\n")

def print_subheader(title):
    print("\n" + "-" * 50)
    print(f"  {title}")
    print("-" * 50 + "\n")

def demo_1_patient_interaction():
    """DEMO 1: Patient says 'I am bored' and receives AI response"""
    print_header("DEMO 1: Patient Interaction")
    print("Scenario: Patient says 'I am bored'")
    print("Expected: AI responds naturally and encouragingly")
    print("Context: Patient P001 (Test Patient, prefers Assamese, family: Son, Daughter)")
    print("Recent Activity: Memory Basket game, 80% accuracy, 1 hint, completed")
    
    print_subheader("Execution")
    
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
            print(f"✓ Patient ID: {data['patient_id']}")
            print(f"✓ Role: {data['role']}")
            print(f"✓ Patient Message: 'I am bored'")
            print(f"✓ AI Response:\n{data['response']}")
            print(f"✓ Language: {data['language']}")
            print("\n✓✓✓ DEMO 1 SUCCESSFUL ✓✓✓")
            return True
        else:
            print(f"✗ DEMO 1 FAILED: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ DEMO 1 FAILED: {str(e)}")
        return False

def demo_2_caregiver_guidance():
    """DEMO 2: Caregiver asks for guidance on patient frustration"""
    print_header("DEMO 2: Caregiver Guidance")
    print("Scenario: Caregiver asks how to help when patient gets frustrated during games")
    print("Expected: AI provides general caregiving guidance (not medical advice)")
    print("Context: Same patient P001 with recent activity data")
    
    print_subheader("Execution")
    
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
            print(f"✓ Patient ID: {data['patient_id']}")
            print(f"✓ Role: {data['role']}")
            print(f"✓ Caregiver Question: 'How can I help when the patient gets frustrated during a game?'")
            print(f"✓ AI Guidance:\n{data['response']}")
            print(f"✓ Language: {data['language']}")
            print("\n✓✓✓ DEMO 2 SUCCESSFUL ✓✓✓")
            return True
        else:
            print(f"✗ DEMO 2 FAILED: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ DEMO 2 FAILED: {str(e)}")
        return False

def demo_3_health_worker_summary():
    """DEMO 3: Health worker requests patient summary"""
    print_header("DEMO 3: Health Worker Summary")
    print("Scenario: Health worker asks for patient summary")
    print("Expected: AI summarizes patient activity and performance data")
    print("Context: Patient P001 with recent game performance metrics")
    
    print_subheader("Execution")
    
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
            print(f"✓ Patient ID: {data['patient_id']}")
            print(f"✓ Role: {data['role']}")
            print(f"✓ Health Worker Question: 'What should I know about this patient?'")
            print(f"✓ AI Summary:\n{data['response']}")
            print(f"✓ Language: {data['language']}")
            print("\n✓✓✓ DEMO 3 SUCCESSFUL ✓✓✓")
            return True
        else:
            print(f"✗ DEMO 3 FAILED: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ DEMO 3 FAILED: {str(e)}")
        return False

def demo_4_regional_language_flow():
    """DEMO 4: Regional language support (translation + TTS)"""
    print_header("DEMO 4: Regional Language Support")
    print("Scenario: English text translated to Assamese and converted to speech")
    print("Expected: Translation succeeds, TTS generates audio file")
    print("Services: Sarvam Translation + Sarvam TTS")
    
    print_subheader("Step 1: Translation (English → Assamese)")
    
    try:
        translate_response = requests.post(
            f"{BASE_URL}/translate",
            json={
                "text": "Would you like to play a memory game with me?",
                "source_language": "en-IN",
                "target_language": "as-IN"
            }
        )
        
        if translate_response.status_code == 200:
            translate_data = translate_response.json()
            print(f"✓ English: Would you like to play a memory game with me?")
            print(f"✓ Assamese: {translate_data['translated_text']}")
            translated_text = translate_data['translated_text']
        else:
            print(f"✗ Translation failed: {translate_response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Translation failed: {str(e)}")
        return False
    
    print_subheader("Step 2: Text-to-Speech (Hindi as fallback)")
    
    try:
        tts_response = requests.post(
            f"{BASE_URL}/speech/text-to-speech",
            json={
                "text": translated_text,
                "language": "hi-IN",  # Using Hindi as Assamese TTS may not be supported
                "speaker": "shubh"
            }
        )
        
        if tts_response.status_code == 200:
            tts_data = tts_response.json()
            print(f"✓ Audio file generated: {tts_data['audio_file']}")
            print("\n✓✓✓ DEMO 4 SUCCESSFUL ✓✓✓")
            return True
        else:
            print(f"✗ TTS failed: {tts_response.text}")
            return False
            
    except Exception as e:
        print(f"✗ TTS failed: {str(e)}")
        return False

def demo_5_voice_interaction():
    """DEMO 5: Voice interaction (STT)"""
    print_header("DEMO 5: Voice Interaction")
    print("Scenario: Patient voice input transcribed to text")
    print("Expected: Audio file transcribed successfully")
    print("Services: Sarvam Speech-to-Text")
    
    print_subheader("Execution")
    
    try:
        audio_file_path = "test_output.wav"
        if not os.path.exists(audio_file_path):
            print(f"✗ Audio file not found: {audio_file_path}")
            print("Note: This demo requires a pre-existing audio file")
            return False
        
        with open(audio_file_path, 'rb') as audio_file:
            files = {'audio_file': (audio_file_path, audio_file, 'audio/wav')}
            stt_response = requests.post(
                f"{BASE_URL}/speech/speech-to-text",
                files=files
            )
        
        if stt_response.status_code == 200:
            stt_data = stt_response.json()
            print(f"✓ Audio file: {audio_file_path}")
            print(f"✓ Transcript: {stt_data['transcript']}")
            print("\n✓✓✓ DEMO 5 SUCCESSFUL ✓✓✓")
            return True
        else:
            print(f"✗ STT failed: {stt_response.text}")
            return False
            
    except Exception as e:
        print(f"✗ STT failed: {str(e)}")
        return False

def main():
    print_header("SIH AI COMPANION - FINAL DEMO SCENARIOS")
    print("Smart India Hackathon 2026")
    print("AI-based cognitive gaming and memory assistance platform")
    print("North-Eastern Region (NER) focus")
    
    print("\nNOTE: These demos require the FastAPI server to be running at http://127.0.0.1:8000")
    print("Start server with: uvicorn backend.main:app --reload")
    
    print("\nIMPORTANT: Gemini API has a free tier limit of 20 requests/day.")
    print("If you see 429 quota errors, wait ~48 hours for quota reset or upgrade API plan.")
    
    input("\nPress Enter to start demos...")
    
    results = {}
    
    # Demo 1: Patient Interaction
    results['Demo 1'] = demo_1_patient_interaction()
    time.sleep(2)
    
    # Demo 2: Caregiver Guidance
    results['Demo 2'] = demo_2_caregiver_guidance()
    time.sleep(2)
    
    # Demo 3: Health Worker Summary
    results['Demo 3'] = demo_3_health_worker_summary()
    time.sleep(2)
    
    # Demo 4: Regional Language
    results['Demo 4'] = demo_4_regional_language_flow()
    time.sleep(2)
    
    # Demo 5: Voice Interaction
    results['Demo 5'] = demo_5_voice_interaction()
    
    # Summary
    print_header("DEMO SUMMARY")
    for demo, success in results.items():
        status = "✓ PASSED" if success else "✗ FAILED"
        print(f"{demo}: {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} demos successful")
    
    if passed == total:
        print("\n🎉 ALL DEMOS SUCCESSFUL! 🎉")
    else:
        print(f"\n⚠️  {total - passed} demo(s) failed due to API quota or other issues")

if __name__ == "__main__":
    main()
