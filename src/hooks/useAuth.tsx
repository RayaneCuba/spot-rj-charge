import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Criar contexto de autenticação
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVisitor: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsVisitor: () => void;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de usuário visitante
const VISITOR_USER: User = {
  id: 'visitor-user-id',
  app_metadata: {},
  user_metadata: { name: 'Visitante' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'visitante@electrospot.app',
} as User;

// Provider de autenticação para envolver a aplicação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(false);

  // Função para atualizar a sessão
  const refreshSession = async () => {
    if (!isSupabaseConnected() || isVisitor) return;
    
    try {
      // Para o Supabase real, usamos o método getSession() e depois refreshSession()
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
  };

  useEffect(() => {
    // Verificar se já estava no modo visitante
    const visitorMode = localStorage.getItem('visitorMode') === 'true';
    if (visitorMode) {
      setIsVisitor(true);
      setUser(VISITOR_USER);
      setLoading(false);
      return;
    }

    // Se não estiver usando Supabase real, sair cedo
    if (!isSupabaseConnected()) {
      setLoading(false);
      return;
    }

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Verificar sessão expirada
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token de autenticação atualizado');
        } else if (event === 'SIGNED_OUT') {
          // Limpar dados da sessão
          setIsVisitor(false);
          localStorage.removeItem('visitorMode');
        }
        
        setLoading(false);
      }
    );

    // Carregar sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // Configurar refresher automático para sessões próximas da expiração
      if (currentSession) {
        const expiresAt = currentSession.expires_at;
        if (expiresAt) {
          const expirationTime = expiresAt * 1000; // Convert to milliseconds
          const timeUntilExpiry = expirationTime - Date.now();
          const refreshTime = timeUntilExpiry - (5 * 60 * 1000); // 5 minutos antes da expiração
          
          if (refreshTime > 0) {
            setTimeout(() => refreshSession(), refreshTime);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Se não estiver usando Supabase real, simular login
      if (!isSupabaseConnected()) {
        setIsVisitor(true);
        setUser(VISITOR_USER);
        localStorage.setItem('visitorMode', 'true');
        toast.success('Modo de demonstração ativado');
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Desativar modo visitante ao fazer login real
      setIsVisitor(false);
      localStorage.removeItem('visitorMode');
      
      toast.success('Login realizado com sucesso');
    } catch (error: any) {
      toast.error(`Erro ao fazer login: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Desativar modo visitante ao se cadastrar
      setIsVisitor(false);
      localStorage.removeItem('visitorMode');
      
      toast.success('Cadastro realizado. Verifique seu email para confirmar');
    } catch (error: any) {
      toast.error(`Erro ao criar conta: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isVisitor) {
        // Saída do modo visitante
        setIsVisitor(false);
        setUser(null);
        localStorage.removeItem('visitorMode');
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
  };

  const signInAsVisitor = () => {
    setIsVisitor(true);
    setUser(VISITOR_USER);
    setSession(null);
    localStorage.setItem('visitorMode', 'true');
    toast.success('Entrou como visitante');
  };

  const value = {
    session,
    user,
    loading,
    isVisitor,
    signIn,
    signUp,
    signOut,
    signInAsVisitor,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar a autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
}
