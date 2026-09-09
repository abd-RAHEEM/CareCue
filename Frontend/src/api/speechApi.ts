import { API_BASE_URL } from './config';

export interface SpeechToTextResult {
  transcript: string;
}

export interface TextToSpeechResult {
  message: string;
  audio_file: string;
}

/**
 * Convert speech to text using Sarvam STT backend
 */
export async function speechToText(audioBlob: Blob): Promise<SpeechToTextResult> {
  const formData = new FormData();
  formData.append('audio_file', audioBlob, 'recording.wav');

  const response = await fetch(`${API_BASE_URL}/speech/speech-to-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Speech-to-text failed: ${response.status} - ${errorData.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Convert text to speech using Sarvam TTS backend
 */
export async function textToSpeech(
  text: string,
  language: string,
  speaker: string = 'shubh'
): Promise<TextToSpeechResult> {
  const response = await fetch(`${API_BASE_URL}/speech/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      language,
      speaker,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Text-to-speech failed: ${response.status} - ${errorData.detail || response.statusText}`);
  }

  return response.json();
}

/**
 * Get audio file URL from backend
 */
export function getAudioUrl(filename: string): string {
  return `${API_BASE_URL}/speech/audio/${filename}`;
}
