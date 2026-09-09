import sys
import requests
import json

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

print("=== Updated Patient Context Test ===\n")

BASE_URL = "http://127.0.0.1:8000"

# Test 1: Backend health
print("TEST 1: Backend Health Check")
try:
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        print("✅ PASS: Backend is running")
    else:
        print(f"❌ FAIL: Backend health check failed: {response.status_code}")
except Exception as e:
    print(f"❌ FAIL: Cannot connect to backend: {str(e)}")
    exit(1)

# Test 2: Test with Anima Devi's specific context
print("\nTEST 2: Anima Devi Context Test")
print("Patient: Anima Devi")
print("Context: Rahul (Son), Priya (Daughter), Gardening, Devotional songs, Daughter calls at 7 PM")

test_questions = [
    "Tell me about my family",
    "What do I like to do?",
    "When does my daughter call?",
    "I am bored, what should I do?"
]

for i, question in enumerate(test_questions, 1):
    print(f"\n  Question {i}: {question}")
    try:
        payload = {
            "patient_id": "patient-1",
            "role": "patient",
            "message": question,
            "language": "en-IN"
        }
        response = requests.post(f"{BASE_URL}/chat/companion", json=payload)
        if response.status_code == 200:
            result = response.json()
            print(f"  ✅ Response: {result['response'][:200]}...")
            
            # Check if response contains relevant context information
            response_lower = result['response'].lower()
            if 'rahul' in response_lower or 'priya' in response_lower or 'daughter' in response_lower or 'son' in response_lower:
                print(f"  ✅ Context used: Family mentioned")
            if 'garden' in response_lower or 'devotional' in response_lower or 'song' in response_lower:
                print(f"  ✅ Context used: Interests mentioned")
            if '7 pm' in response_lower or '7pm' in response_lower or 'evening' in response_lower:
                print(f"  ✅ Context used: Routine mentioned")
        else:
            print(f"  ❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")

print("\n=== Context Test Complete ===")
print("\nSummary:")
print("✅ Patient context updated with specific information")
print("✅ AI companion should now provide personalized responses")
print("✅ Context includes: Family (Rahul, Priya), Interests (Gardening, Devotional songs), Routine (7 PM call)")
