
import { User } from '@supabase/supabase-js';

// Mock de usuário visitante
export const VISITOR_USER: User = {
  id: 'visitor-user-id',
  app_metadata: {},
  user_metadata: { name: 'Visitante' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'visitante@electrospot.app',
} as User;

export const VISITOR_MODE_KEY = 'visitorMode';
