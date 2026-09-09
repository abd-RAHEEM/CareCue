// Environment flag — flip to false to use real HTTP backend
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA ?? 'false') === 'true';

// In local development, default to local FastAPI port 8000; in production (Vercel fullstack), default to same-origin relative path ''
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');
