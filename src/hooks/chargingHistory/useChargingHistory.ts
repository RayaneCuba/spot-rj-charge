
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
} from './chargingHistoryService';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncQueue } from '@/lib/syncQueue';
import { useSyncStatus, processQueueWithConnectedUser } from '@/lib/syncService';
import { generateMockSessions } from './chargingHistoryUtils';

export function useChargingHistory() {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { addOperation } = useSyncQueue();
  const { isSyncing } = useSyncStatus();

  // Carregar histórico do Supabase ou localStorage (fallback)
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        if (user && isSupabaseConnected() && isOnline) {
          // Se o usuário estiver logado e online, carregar do Supabase
          try {
            const loadedSessions = await loadHistoryFromSupabase(user.id);
            setSessions(loadedSessions);
            
            // Salvar também no localStorage como cache
            saveHistoryToLocalStorage(loadedSessions);
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
  }, [user, isOnline]);

  // Salvar histórico no localStorage quando mudar (fallback)
  useEffect(() => {
    if (!isLoading) {
      saveHistoryToLocalStorage(sessions);
    }
  }, [sessions, isLoading]);

  // Sincronizar fila quando o usuário estiver online
  useEffect(() => {
    // Não fazer nada se não houver usuário
    if (!user) return;
    
    // Não tentar sincronizar se offline
    if (!isOnline) return;
    
    // Sincronizar periódicamente quando online
    const interval = setInterval(() => {
      if (user && !isSyncing) {
        processQueueWithConnectedUser(user.id)
          .then(result => {
            if (result.processedCount > 0) {
              // Recarregar dados após sincronização bem-sucedida
              loadHistoryFromSupabase(user.id)
                .then(updatedSessions => {
                  setSessions(updatedSessions);
                  saveHistoryToLocalStorage(updatedSessions);
                })
                .catch(console.error);
            }
          })
          .catch(console.error);
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [user, isOnline]);

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
    
    // Salvar no localStorage para persistência local
    saveHistoryToLocalStorage([newSession, ...sessions].slice(0, 20));
    
    // Adicionar à fila de sincronização se o usuário estiver logado
    if (user) {
      addOperation({
        entity: 'chargingHistory',
        action: 'create',
        data: newSession,
        userId: user.id
      });
      
      // Se online, tentar sincronizar imediatamente
      if (isOnline && isSupabaseConnected()) {
        processQueueWithConnectedUser(user.id).catch(console.error);
      } else {
        toast("Modo Offline", {
          description: "Carregamento salvo localmente. Será sincronizado quando online."
        });
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
    getRecentSessions,
    syncStatus: {
      isSyncing,
      isOnline,
      lastSyncAttempt: useSyncStatus.getState().lastSyncAttempt,
      lastSuccessfulSync: useSyncStatus.getState().lastSuccessfulSync
    }
  };
}

// Re-exportar função generateMockSessions para manter compatibilidade
export { generateMockSessions };
