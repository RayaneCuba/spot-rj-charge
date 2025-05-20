
import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente do Supabase ou usar valores mockados para desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar se temos credenciais válidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Supabase mockado inicializado - sem credenciais de API');
}

// Verificar se estamos em modo de desenvolvimento/visitante
const isLocalDevelopment = !supabaseUrl || !supabaseAnonKey || !supabaseUrl.includes('https://');

// Criar um cliente mockado com métodos que retornam funções em vez de objetos vazios
export const supabase = isLocalDevelopment
  ? {
      // Cliente mockado com métodos comuns simulados
      auth: {
        signInWithPassword: async () => ({ data: {}, error: null }),
        signUp: async () => ({ data: {}, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        // Simulação do método admin para uso em Profile.tsx
        admin: {
          deleteUser: async () => ({ data: {}, error: null })
        }
      },
      from: (table: string) => ({
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
            // Método order mockado para ser chamável
            order: () => ({
              limit: () => Promise.resolve({
                data: [],
                error: null,
              }),
              // Result direto se limit não for chamado
              data: [],
              error: null
            }),
          }),
          // Método order disponível diretamente em select para suportar ambos os fluxos
          order: () => ({
            limit: () => Promise.resolve({
              data: [],
              error: null,
            }),
            // Result direto se limit não for chamado
            data: [],
            error: null
          }),
        }),
        insert: () => ({ error: null }),
        delete: () => ({
          // Tornar o método eq uma função chamável
          eq: () => ({
            // Adicionar outro eq aninhado para suportar múltiplas chamadas de eq
            eq: () => Promise.resolve({ 
              data: null,
              error: null 
            }),
            data: null,
            error: null
          }),
          error: null
        }),
      }),
    }
  : createClient(supabaseUrl, supabaseAnonKey);

// Exportar funções adicionais para verificar se o Supabase está conectado
export const isSupabaseConnected = () => !isLocalDevelopment;

console.log(`Supabase ${isLocalDevelopment ? 'mockado' : 'conectado'} inicializado`);
