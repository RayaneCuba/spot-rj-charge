
import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente do Supabase ou usar valores mockados para desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-development';

// Verificar se estamos em modo de desenvolvimento/visitante
const isLocalDevelopment = !supabaseUrl.includes('https://') || supabaseUrl === 'https://mock.supabase.co';

// Criar um cliente mockado ou real
export const supabase = isLocalDevelopment
  ? {
      // Cliente mockado com métodos comuns simulados
      auth: {
        signInWithPassword: async () => ({ data: {}, error: null }),
        signUp: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          }),
          order: () => ({
            limit: () => ({
              data: [],
              error: null,
            }),
          }),
        }),
        insert: () => ({ error: null }),
        delete: () => ({
          eq: () => ({ error: null }),
        }),
      }),
    }
  : createClient(supabaseUrl, supabaseAnonKey);

// Exportar funções adicionais para verificar se o Supabase está conectado
export const isSupabaseConnected = () => !isLocalDevelopment;

console.log(`Supabase ${isLocalDevelopment ? 'mockado' : 'conectado'} inicializado`);
