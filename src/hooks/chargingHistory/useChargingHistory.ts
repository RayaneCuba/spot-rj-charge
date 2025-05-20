
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Station } from '@/types/Station';
import { isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from '../useAuth';
import { ChargingSession } from './types';
import { 
  loadHistoryFromSupabase, 
  loadHistoryFromLocalStorage,
  saveHistoryToLocalStorage,
  saveChargingToSupabase 
} from './chargingHistoryService';

export function useChargingHistory() {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Carregar histórico do Supabase ou localStorage (fallback)
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        if (user && isSupabaseConnected()) {
          // Se o usuário estiver logado, carregar do Supabase
          try {
            const loadedSessions = await loadHistoryFromSupabase(user.id);
            setSessions(loadedSessions);
          } catch (error) {
            console.error('Fallback para mocks após erro na consulta:', error);
            // Fallback para mocks em caso de erro
            const mockSessions = generateMockSessions(5);
            setSessions(mockSessions);
          }
        } else {
          // Caso contrário, usar localStorage como fallback
          const localSessions = loadHistoryFromLocalStorage();
          setSessions(localSessions);
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        toast.error('Não foi possível carregar seu histórico de carregamentos');
        
        // Tentar carregar do localStorage em caso de erro
        try {
          const storedHistory = localStorage.getItem('chargingHistory');
          if (storedHistory) {
            setSessions(JSON.parse(storedHistory));
          } else {
            // Se não existir histórico, criar alguns registros simulados
            const mockSessions = generateMockSessions(3);
            setSessions(mockSessions);
          }
        } catch {} // Ignorar erros do fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  // Salvar histórico no localStorage quando mudar (fallback)
  useEffect(() => {
    if (!isLoading && !user) {
      saveHistoryToLocalStorage(sessions);
    }
  }, [sessions, isLoading, user]);

  // Simular novo carregamento em uma estação
  const simulateCharging = async (station: Station) => {
    const now = new Date();
    const duration = Math.floor(Math.random() * 40) + 15; // 15-55 minutos
    const energy = parseFloat((Math.random() * 30 + 5).toFixed(1)); // 5-35 kWh
    const cost = parseFloat((energy * 1.95).toFixed(2)); // R$ 1,95 por kWh
    
    const newSession: ChargingSession = {
      id: Date.now(),
      stationId: station.id,
      stationName: station.name,
      date: now.toISOString(),
      duration,
      energy,
      cost,
      status: Math.random() > 0.8 ? "interrompido" : "completo"
    };

    // Adicionar ao início da lista para UI imediata
    setSessions(prev => [newSession, ...prev].slice(0, 20));
    
    // Salvar no Supabase se o usuário estiver logado
    if (user && isSupabaseConnected()) {
      try {
        await saveChargingToSupabase(user.id, newSession);
      } catch (error) {
        // Erro já tratado em saveChargingToSupabase
        // Não reverter o estado local para não confundir o usuário
      }
    }
    
    toast.success(`Carregamento simulado em ${station.name}`);
    return newSession;
  };

  // Obter as sessões mais recentes
  const getRecentSessions = (count: number = 5) => {
    return sessions.slice(0, count);
  };

  return {
    sessions,
    isLoading,
    simulateCharging,
    getRecentSessions
  };
}

// Re-exportar função generateMockSessions para manter compatibilidade
import { generateMockSessions } from './chargingHistoryUtils';
export { generateMockSessions };
