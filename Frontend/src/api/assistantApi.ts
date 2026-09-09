import { useStore } from '../store/store';
import type { AssistantReply } from '../types';
import { USE_MOCK, API_BASE_URL } from './config';

// ── Scripted response engine (mock implementation) ────────────────────────────
// SWAP POINT: Replace this function with a real LLM/AI call when your AI teammate
// is ready. The function signature stays the same — only the implementation changes.

function generateMockReply(patientId: string, message: string): AssistantReply {
  const state = useStore.getState();
  const patient = state.patients[patientId];
  if (!patient) {
    return { reply: "I'm sorry, I couldn't find your information right now. Please ask your caregiver for help.", escalateToCaregiver: true };
  }
  const { memoryGraph, reminders, routine } = patient;
  const msg = message.toLowerCase();

  // ── Who is [person] ───────────────────────────────────────────────────────
  const personMatch = memoryGraph.people.find(p =>
    msg.includes(p.name.toLowerCase()) || msg.includes(p.relation.toLowerCase())
  );
  if (personMatch || msg.includes('who is') || msg.includes('who are')) {
    if (personMatch) {
      return {
        reply: `${personMatch.name} is your ${personMatch.relation}. ${personMatch.description ?? ''} They are someone special to you. 💛`,
        escalateToCaregiver: false,
      };
    }
    const people = memoryGraph.people.slice(0, 3).map(p => `${p.name} (${p.relation})`).join(', ');
    return {
      reply: `Some of your loved ones are: ${people}. Would you like to know more about any of them?`,
      escalateToCaregiver: false,
    };
  }

  // ── What do I do next / routine ───────────────────────────────────────────
  if (msg.includes('next') || msg.includes('routine') || msg.includes('what do i do') || msg.includes('schedule')) {
    const now = new Date();
    const currentHour = now.getHours() * 100 + now.getMinutes();
    const upcoming = routine.find(step => {
      if (!step.time || step.completed) return false;
      const [h, m] = step.time.split(':').map(Number);
      return h * 100 + m >= currentHour;
    });
    if (upcoming) {
      return {
        reply: `Your next step is: "${upcoming.icon ?? ''} ${upcoming.label}" at ${upcoming.time}. Take your time — there's no rush. 🌸`,
        escalateToCaregiver: false,
      };
    }
    return { reply: `You've done so well today! Your routine for today is nearly complete. Time to rest. 😊`, escalateToCaregiver: false };
  }

  // ── Medicine ───────────────────────────────────────────────────────────────
  if (msg.includes('medicine') || msg.includes('tablet') || msg.includes('pill') || msg.includes('medication') || msg.includes('take')) {
    const medReminders = reminders.filter(r => r.type === 'medicine');
    const pending = medReminders.filter(r => r.status === 'pending');
    const taken = medReminders.filter(r => r.status === 'taken');
    if (taken.length > 0 && pending.length === 0) {
      return { reply: `You've taken all your medicines for now. Well done! 💊✅ Next medicine time will be coming soon.`, escalateToCaregiver: false };
    }
    if (pending.length > 0) {
      return { reply: `Your medicine "${pending[0].label}" is due at ${pending[0].time}. Please check your medicine box. 💊`, escalateToCaregiver: false };
    }
    return { reply: `I can see your medicine reminders are set. Check the Reminders tab for details. 💊`, escalateToCaregiver: false };
  }

  // ── Appointment ───────────────────────────────────────────────────────────
  if (msg.includes('appointment') || msg.includes('doctor') || msg.includes('hospital')) {
    const appt = reminders.find(r => r.type === 'appointment');
    if (appt) {
      return { reply: `Your appointment is: "${appt.label}" at ${appt.time}. ${appt.notes ?? ''} 🏥`, escalateToCaregiver: false };
    }
    return { reply: `I don't see any upcoming appointments right now. If you need to check, I can let your caregiver know. 🏥`, escalateToCaregiver: false };
  }

  // ── Family call ───────────────────────────────────────────────────────────
  if (msg.includes('call') || msg.includes('son') || msg.includes('daughter') || msg.includes('family') || msg.includes('ramen') || msg.includes('priya')) {
    const call = reminders.find(r => r.type === 'familyCall');
    if (call) {
      return { reply: `You have a family call scheduled: "${call.label}" at ${call.time}. 📞 Looking forward to it!`, escalateToCaregiver: false };
    }
    const son = memoryGraph.people.find(p => p.relation.toLowerCase().includes('son'));
    if (son) {
      return { reply: `${son.name} loves you very much! ${son.description ?? ''}. I'll let your caregiver know you're thinking of them. 💛`, escalateToCaregiver: true };
    }
    return { reply: `Your family loves you. Would you like me to let your caregiver know you'd like to talk to someone? 💛`, escalateToCaregiver: true };
  }

  // ── Where is [object] ────────────────────────────────────────────────────
  const objectMatch = memoryGraph.objects.find(o =>
    msg.includes(o.name.toLowerCase()) || msg.includes(o.id.toLowerCase())
  );
  if (objectMatch || msg.includes('where') || msg.includes('find') || msg.includes('lost')) {
    if (objectMatch) {
      return { reply: `Your ${objectMatch.name} is usually at: ${objectMatch.usualLocation}. 📍 I hope that helps!`, escalateToCaregiver: false };
    }
    const objs = memoryGraph.objects.map(o => `${o.name} → ${o.usualLocation}`).join('; ');
    return { reply: `Here are some things and their usual places: ${objs}. If you're still having trouble, I can ask your caregiver. 🔍`, escalateToCaregiver: false };
  }

  // ── Song ─────────────────────────────────────────────────────────────────
  if (msg.includes('song') || msg.includes('music') || msg.includes('sing') || msg.includes('play')) {
    const song = memoryGraph.songs[0];
    return {
      reply: `One of your favourite songs is "${song?.title ?? 'Bihu songs'}". 🎵 Go to Activities → Music & Rhythm to play along! Music is wonderful for the heart.`,
      escalateToCaregiver: false,
    };
  }

  // ── Emotional distress ───────────────────────────────────────────────────
  if (msg.includes('confused') || msg.includes('scared') || msg.includes('worried') || msg.includes('sad') || msg.includes('lost') || msg.includes('help') || msg.includes('alone') || msg.includes('don\'t know') || msg.includes('forgot')) {
    return {
      reply: `It's okay to feel this way. You are safe and cared for. 🌸 I'm letting your caregiver know you'd like some company right now. You are not alone.`,
      escalateToCaregiver: true,
    };
  }

  // ── Greetings ────────────────────────────────────────────────────────────
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('namaste') || msg.includes('good morning') || msg.includes('good evening')) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return {
      reply: `${greeting}, ${patient.name.split(' ')[0]}! 🌸 I'm CareCue, your friendly helper. You can ask me about your family, medicines, what to do next, or anything you need. How are you feeling today?`,
      escalateToCaregiver: false,
    };
  }

  // ── Hydration ─────────────────────────────────────────────────────────────
  if (msg.includes('water') || msg.includes('drink') || msg.includes('thirsty')) {
    return { reply: `Drinking water is so important! 💧 Please have a glass of water now. Your caregiver has set hydration reminders for you throughout the day.`, escalateToCaregiver: false };
  }

  // ── Default / unknown ─────────────────────────────────────────────────────
  return {
    reply: `I want to help, but I'm not sure about that. I only know about your personal information, routine, and reminders. Should I let your caregiver know you have a question? They'll be happy to help. 💛`,
    escalateToCaregiver: true,
  };
}

// Public API function — SWAP POINT for real AI/LLM teammate
export async function getAssistantReply(patientId: string, message: string): Promise<AssistantReply> {
  if (USE_MOCK) {
    // Simulate a brief thinking delay
    await new Promise(r => setTimeout(r, 600));
    const reply = generateMockReply(patientId, message);
    // Log engagement (count only — not transcript content — for caregiver privacy)
    useStore.getState().addChatMessage({
      patientId,
      sender: 'patient',
      text: message,
      timestamp: new Date().toISOString(),
    });
    useStore.getState().addChatMessage({
      patientId,
      sender: 'assistant',
      text: reply.reply,
      timestamp: new Date().toISOString(),
      escalateToCaregiver: reply.escalateToCaregiver,
    });
    return reply;
  }
  
  // Real backend integration
  try {
    const state = useStore.getState();
    const patient = state.patients[patientId];
    
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Map frontend request to FastAPI format
    const language = patient.preferredLanguage === 'Assamese' ? 'as-IN' : 
                     patient.preferredLanguage === 'English' ? 'en-IN' : 'en-IN';
    
    const requestBody = {
      patient_id: patientId,
      role: 'patient',
      message: message,
      language: language
    };

    const res = await fetch(`${API_BASE_URL}/chat/companion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      let errorDetail = 'Unknown error';
      try {
        const errorData = await res.json();
        errorDetail = errorData.detail || 'Unknown error';
      } catch (e) {
        errorDetail = res.statusText;
      }
      throw new Error(`Backend request failed: ${res.status} - ${errorDetail}`);
    }

    const data = await res.json();
    
    // Map FastAPI response to frontend format
    const reply: AssistantReply = {
      reply: data.response,
      escalateToCaregiver: false, // Backend doesn't currently support escalation, default to false
    };

    // Log engagement for consistency with mock mode
    useStore.getState().addChatMessage({
      patientId,
      sender: 'patient',
      text: message,
      timestamp: new Date().toISOString(),
    });
    useStore.getState().addChatMessage({
      patientId,
      sender: 'assistant',
      text: reply.reply,
      timestamp: new Date().toISOString(),
      escalateToCaregiver: reply.escalateToCaregiver,
    });

    return reply;
  } catch (error) {
    console.error('Backend assistant error:', error);
    
    // Check if it's a quota error (429)
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('429') || errorMessage.includes('quota')) {
      return {
        reply: "I'm experiencing high demand right now. Please try again in a few minutes, or ask your caregiver for help.",
        escalateToCaregiver: false,
      };
    }
    
    // Return a fallback error response for other errors
    return {
      reply: "I'm having trouble connecting right now. Please try again or ask your caregiver for help.",
      escalateToCaregiver: true,
    };
  }
}
