
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Station } from '@/types/Station';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface ChargingSession {
  id: number;
  stationId: number;
  stationName: string;
  date: string;
  duration: number; // em minutos
  energy: number; // em kWh
  cost: number; // em reais
  status: "completo" | "interrompido" | "em andamento";
}

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
            const response = await supabase
              .from('charging_history')
              .select('*, stations(name)')
              .eq('user_id', user.id);
            
            // Verificar se conseguimos usar o método order
            if (response && 'order' in response) {
              const { data, error } = await response
                .order('date', { ascending: false })
                .limit(20);
                
              if (error) throw error;
              
              if (data) {
                // Formatar os dados para o formato esperado
                const formattedSessions = data.map(item => ({
                  id: item.id,
                  stationId: item.station_id,
                  stationName: item.stations.name,
                  date: item.date,
                  duration: item.duration,
                  energy: item.energy,
                  cost: item.cost,
                  status: item.status
                }));
                setSessions(formattedSessions);
              }
            } else {
              // Fallback para cliente mockado
              const mockSessions = generateMockSessions(5);
              setSessions(mockSessions);
            }
          } catch (error) {
            console.error('Erro na consulta do Supabase:', error);
            // Fallback para mocks em caso de erro
            const mockSessions = generateMockSessions(5);
            setSessions(mockSessions);
          }
        } else {
          // Caso contrário, usar localStorage como fallback
          const storedHistory = localStorage.getItem('chargingHistory');
          if (storedHistory) {
            setSessions(JSON.parse(storedHistory));
          } else {
            // Se não existir histórico, criar alguns registros simulados
            const mockSessions = generateMockSessions(3);
            setSessions(mockSessions);
            localStorage.setItem('chargingHistory', JSON.stringify(mockSessions));
          }
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
      localStorage.setItem('chargingHistory', JSON.stringify(sessions));
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
        const { error } = await supabase.from('charging_history').insert({
          user_id: user.id,
          station_id: station.id,
          date: newSession.date,
          duration: newSession.duration,
          energy: newSession.energy,
          cost: newSession.cost,
          status: newSession.status
        });
        
        if (error) throw error;
      } catch (error) {
        console.error('Erro ao salvar carregamento:', error);
        toast.error('Erro ao registrar carregamento. Tente novamente.');
        // Não reverter o estado local para não confundir o usuário
      }
    }
    
    toast.success(`Carregamento simulado em ${station.name}`);
    return newSession;
  };

  // Gerar sessões aleatórias para o mock inicial
  const generateMockSessions = (count: number): ChargingSession[] => {
    const mockStations = [
      { id: 1, name: "Eletroposto Shopping Rio Sul" },
      { id: 2, name: "Eletroposto Barra Shopping" },
      { id: 3, name: "Eletroposto Estacionamento Gávea" },
      { id: 4, name: "Eletroposto Botafogo Praia Shopping" }
    ];
    
    const mockSessions: ChargingSession[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomStation = mockStations[Math.floor(Math.random() * mockStations.length)];
      const date = new Date();
      date.setDate(date.getDate() - i - Math.floor(Math.random() * 5)); // Data de 1-10 dias atrás
      
      const duration = Math.floor(Math.random() * 40) + 15; // 15-55 minutos
      const energy = parseFloat((Math.random() * 30 + 5).toFixed(1)); // 5-35 kWh
      const cost = parseFloat((energy * 1.95).toFixed(2)); // R$ 1,95 por kWh
      
      mockSessions.push({
        id: Date.now() - i * 100000,
        stationId: randomStation.id,
        stationName: randomStation.name,
        date: date.toISOString(),
        duration,
        energy,
        cost,
        status: Math.random() > 0.8 ? "interrompido" : "completo"
      });
    }
    
    return mockSessions;
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
