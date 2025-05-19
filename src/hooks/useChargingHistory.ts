
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Station } from '@/types/Station';

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

  // Carregar histórico do localStorage ao inicializar
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem('chargingHistory');
        if (storedHistory) {
          setSessions(JSON.parse(storedHistory));
        } else {
          // Se não existir histórico, criar alguns registros simulados
          const mockSessions = generateMockSessions(3);
          setSessions(mockSessions);
          localStorage.setItem('chargingHistory', JSON.stringify(mockSessions));
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        toast.error('Não foi possível carregar seu histórico de carregamentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('chargingHistory', JSON.stringify(sessions));
    }
  }, [sessions, isLoading]);

  // Simular novo carregamento em uma estação
  const simulateCharging = (station: Station) => {
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

    // Adicionar ao início da lista para manter os mais recentes no topo
    setSessions(prev => [newSession, ...prev].slice(0, 20)); // Manter só os 20 mais recentes
    
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
