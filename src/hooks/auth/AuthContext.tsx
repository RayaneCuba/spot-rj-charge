
import { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { AuthContextType } from './types';
import { 
  VISITOR_USER, 
  VISITOR_MODE_KEY 
} from './constants';
import {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handleRefreshSession,
  handleSignInAsVisitor,
  configureSessionRefresh
} from './utils';

// Criar contexto de autenticação
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider de autenticação para envolver a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(false);

  // Função para atualizar a sessão
  const refreshSession = async () => {
    await handleRefreshSession(isVisitor, setSession, setUser, signOut);
  };

  useEffect(() => {
    // Verificar se já estava no modo visitante
    const visitorMode = localStorage.getItem(VISITOR_MODE_KEY) === 'true';
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
          localStorage.removeItem(VISITOR_MODE_KEY);
        }
        
        setLoading(false);
      }
    );

    // Carregar sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // Configurar refresher para sessões próximas da expiração
      configureSessionRefresh(currentSession, refreshSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await handleSignIn(email, password, setLoading, setIsVisitor, setUser);
  };

  const signUp = async (email: string, password: string) => {
    await handleSignUp(email, password, setLoading, setIsVisitor);
  };

  const signOut = async () => {
    await handleSignOut(isVisitor, setLoading, setIsVisitor, setUser);
  };

  const signInAsVisitor = () => {
    handleSignInAsVisitor(setIsVisitor, setUser, setSession);
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
