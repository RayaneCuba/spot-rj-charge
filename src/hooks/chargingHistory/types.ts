
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

export interface ChargingHistoryHook {
  sessions: ChargingSession[];
  isLoading: boolean;
  simulateCharging: (station: Station) => Promise<ChargingSession>;
  getRecentSessions: (count?: number) => ChargingSession[];
}
