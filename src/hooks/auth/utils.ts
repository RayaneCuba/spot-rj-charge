
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { toast } from 'sonner';
import { VISITOR_USER, VISITOR_MODE_KEY } from './constants';

export async function handleSignIn(
  email: string, 
  password: string, 
  setLoading: (loading: boolean) => void,
  setIsVisitor: (isVisitor: boolean) => void, 
  setUser: (user: User | null) => void
) {
  try {
    setLoading(true);
    
    // Se não estiver usando Supabase real, simular login
    if (!isSupabaseConnected()) {
      setIsVisitor(true);
      setUser(VISITOR_USER);
      localStorage.setItem(VISITOR_MODE_KEY, 'true');
      toast.success('Modo de demonstração ativado');
      return;
    }
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
    
    // Desativar modo visitante ao fazer login real
    setIsVisitor(false);
    localStorage.removeItem(VISITOR_MODE_KEY);
    
    toast.success('Login realizado com sucesso');
  } catch (error: any) {
    toast.error(`Erro ao fazer login: ${error.message}`);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function handleSignUp(
  email: string, 
  password: string,
  setLoading: (loading: boolean) => void,
  setIsVisitor: (isVisitor: boolean) => void
) {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      throw error;
    }
    
    // Desativar modo visitante ao se cadastrar
    setIsVisitor(false);
    localStorage.removeItem(VISITOR_MODE_KEY);
    
    toast.success('Cadastro realizado. Verifique seu email para confirmar');
  } catch (error: any) {
    toast.error(`Erro ao criar conta: ${error.message}`);
    throw error;
  } finally {
    setLoading(false);
  }
}

export async function handleSignOut(
  isVisitor: boolean,
  setLoading: (loading: boolean) => void,
  setIsVisitor: (isVisitor: boolean) => void,
  setUser: (user: User | null) => void
) {
  try {
    setLoading(true);
    
    if (isVisitor) {
      // Saída do modo visitante
      setIsVisitor(false);
      setUser(null);
      localStorage.removeItem(VISITOR_MODE_KEY);
      toast.success('Saiu do modo visitante');
    } else {
      // Logout normal do Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Sessão encerrada com sucesso');
    }
  } catch (error: any) {
    toast.error(`Erro ao sair: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

export async function handleRefreshSession(
  isVisitor: boolean,
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  signOut: () => Promise<void>
) {
  if (!isSupabaseConnected() || isVisitor) return;
  
  try {
    // Para o Supabase real, usamos o método getSession()
    if (isSupabaseConnected()) {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      } else {
        // Se não houver sessão, considere fazer logout
        await signOut();
        toast.error('Sua sessão expirou. Por favor, faça login novamente.');
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar sessão:', error);
  }
}

export function handleSignInAsVisitor(
  setIsVisitor: (isVisitor: boolean) => void,
  setUser: (user: User | null) => void,
  setSession: (session: Session | null) => void
) {
  setIsVisitor(true);
  setUser(VISITOR_USER);
  setSession(null);
  localStorage.setItem(VISITOR_MODE_KEY, 'true');
  toast.success('Entrou como visitante');
}

export function configureSessionRefresh(
  session: Session | null, 
  refreshSession: () => Promise<void>
) {
  // Configurar refresher automático para sessões próximas da expiração
  if (session) {
    const expiresAt = session.expires_at;
    if (expiresAt) {
      const expirationTime = expiresAt * 1000; // Convert to milliseconds
      const timeUntilExpiry = expirationTime - Date.now();
      const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutos antes da expiração
      
      if (refreshTime > 0) {
        setTimeout(() => refreshSession(), refreshTime);
      }
    }
  }
}
