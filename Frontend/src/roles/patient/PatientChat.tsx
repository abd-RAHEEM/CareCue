import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, MicOff, AlertCircle, MessageCircle, Loader2 } from 'lucide-react';
import { getAssistantReply } from '../../api/assistantApi';
import { speechToText, textToSpeech, getAudioUrl } from '../../api/speechApi';
import { useStore } from '../../store/store';

// Fallback browser TTS for unsupported languages
function speakBrowser(text: string, lang: string = 'en-IN') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.1; u.lang = lang;
    window.speechSynthesis.speak(u);
  }
}

const SUGGESTED = [
  'What do I do next?',
  'Did I take my medicine?',
  'Who is my son?',
  'Where are my glasses?',
  'When is my appointment?',
  'I feel confused',
  'Play my favourite song',
];

export const PatientChat: React.FC = () => {
  const session = useStore(s => s.session);
  const chatMessages = useStore(s => s.chatMessages);
  const patients = useStore(s => s.patients);
  const patient = session.patientId ? patients[session.patientId] : null;
  const patientMessages = chatMessages.filter(m => m.patientId === session.patientId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [processingSpeech, setProcessingSpeech] = useState(false);
  const [generatingSpeech, setGeneratingSpeech] = useState(false);
  const [micSupported] = useState(() => 'MediaRecorder' in window && 'navigator' in window && 'mediaDevices' in window.navigator);
  const [escalationNotice, setEscalationNotice] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [patientMessages]);

  const sendMessage = async (text: string, useTTS: boolean = true) => {
    if (!text.trim() || !patient || loading) return;
    setInput('');
    setLoading(true);
    setGeneratingSpeech(useTTS);
    
    try {
      const reply = await getAssistantReply(patient.id, text);
      if (reply.escalateToCaregiver) {
        setEscalationNotice(true);
        setTimeout(() => setEscalationNotice(false), 5000);
      }
      
      // Try Sarvam TTS first, fall back to browser TTS
      if (useTTS) {
        const language = patient.preferredLanguage === 'Assamese' ? 'as-IN' : 
                         patient.preferredLanguage === 'English' ? 'en-IN' : 'en-IN';
        
        try {
          const ttsResult = await textToSpeech(reply.reply, language);
          const audioUrl = getAudioUrl(ttsResult.audio_file);
          const audio = new Audio(audioUrl);
          audio.play();
        } catch (ttsError) {
          console.log('Sarvam TTS failed, using browser fallback:', ttsError);
          // Fall back to browser TTS
          const browserLang = patient.preferredLanguage === 'Assamese' ? 'hi-IN' : 'en-IN';
          speakBrowser(reply.reply, browserLang);
        }
      } else {
        speakBrowser(reply.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setGeneratingSpeech(false);
    }
  };

  const startRecording = async () => {
    if (!micSupported || !patient) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        setRecording(false);
        setProcessingSpeech(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const result = await speechToText(audioBlob);
          
          if (result.transcript && result.transcript.trim()) {
            setInput(result.transcript);
            await sendMessage(result.transcript);
          }
        } catch (error) {
          console.error('Speech recognition failed:', error);
          setInput('Could not understand. Please try again or type your message.');
        } finally {
          setProcessingSpeech(false);
          // Stop all tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        }
      };
      
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Microphone access failed:', error);
      alert('Could not access microphone. Please check permissions or type your message.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-[calc(100dvh-130px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 shrink-0">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <MessageCircle size={22} className="text-indigo-700" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-indigo-900">Ask CareCue</h1>
          <p className="text-sm text-gray-500">Your personal helper — always here for you 💛</p>
        </div>
      </div>

      {/* Escalation notice */}
      {escalationNotice && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl mt-3 shrink-0">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">Your caregiver has been notified that you need help. 💛</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
        {patientMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">👋</div>
            <p className="text-2xl font-bold text-gray-800 mb-2">Hello, {patient?.name.split(' ')[0]}!</p>
            <p className="text-gray-500 text-lg">You can ask me anything. Try one of these:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl text-base font-medium cursor-pointer active:scale-95 transition-all border border-indigo-100"
                  style={{ minHeight: 48 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {patientMessages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'patient' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.sender === 'assistant' && (
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-indigo-600" />
              </div>
            )}
            <div className={`max-w-[80%] flex flex-col gap-1 ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-4 rounded-3xl text-lg leading-relaxed ${msg.sender === 'patient'
                ? 'bg-indigo-600 text-white rounded-br-md'
                : 'bg-white border border-gray-100 text-gray-900 rounded-bl-md shadow-sm'}`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                {msg.sender === 'assistant' && (
                  <button onClick={() => speak(msg.text)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer" aria-label="Read aloud">
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-indigo-600" />
            </div>
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-3xl rounded-bl-md shadow-sm">
              <div className="flex items-center gap-2">
                {generatingSpeech ? (
                  <>
                    <Loader2 size={16} className="text-indigo-400 animate-spin" />
                    <span className="text-sm text-gray-600">Speaking...</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-200" />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-3 border-t border-gray-100">
        {/* Suggested shortcuts after some messages */}
        {patientMessages.length > 0 && patientMessages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3">
            {SUGGESTED.slice(0, 4).map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="shrink-0 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl text-sm font-medium cursor-pointer border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition-all"
                style={{ minHeight: 44 }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Voice status message */}
        {(recording || processingSpeech) && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl mb-2">
            {recording && (
              <>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-indigo-700 font-medium">Recording... Release to send</span>
              </>
            )}
            {processingSpeech && (
              <>
                <Loader2 size={16} className="text-indigo-600 animate-spin" />
                <span className="text-sm text-indigo-700 font-medium">Converting speech to text...</span>
              </>
            )}
          </div>
        )}

        <div className="flex gap-3 items-end">
          {/* Mic button */}
          <button
            onMouseDown={startRecording} onMouseUp={stopRecording} 
            onTouchStart={startRecording} onTouchEnd={stopRecording}
            onClick={!micSupported ? () => alert('Voice not supported on this device. Please type your question.') : undefined}
            disabled={loading || processingSpeech}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0 ${
              recording ? 'bg-red-500 text-white animate-pulse-soft' : 
              processingSpeech ? 'bg-amber-500 text-white' :
              loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
              micSupported ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-100 text-gray-400'
            }`}
            aria-label={recording ? 'Recording... Release to send' : processingSpeech ? 'Processing...' : loading ? 'Please wait...' : micSupported ? 'Hold to speak' : 'Voice not supported'}
            title={recording ? 'Recording... Release to send' : processingSpeech ? 'Processing speech...' : loading ? 'Please wait...' : micSupported ? 'Hold to speak' : 'Voice not supported on this device'}
          >
            {recording ? <MicOff size={24} /> : processingSpeech ? <Loader2 size={24} className="animate-spin" /> : <Mic size={24} />}
          </button>

          <div className="flex-1 flex gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Type your question here..."
              rows={1}
              className="flex-1 resize-none rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 outline-none px-4 py-3 text-lg bg-white text-gray-900 placeholder:text-gray-400"
              style={{ minHeight: 56 }}
              aria-label="Type your message"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-all disabled:opacity-40 shrink-0"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        {!micSupported && <p className="text-xs text-center text-gray-400 mt-2">Voice input not available on this device/browser.</p>}
      </div>
    </div>
  );
};
