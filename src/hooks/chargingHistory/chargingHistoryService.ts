
import { toast } from 'sonner';
import { Station } from '@/types/Station';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { ChargingSession } from './types';
import { generateMockSessions } from './chargingHistoryUtils';

// Carregar histórico do Supabase
export const loadHistoryFromSupabase = async (userId: string): Promise<ChargingSession[]> => {
  try {
    // Primeiro, faça a consulta básica
    const query = supabase
      .from('charging_history')
      .select('*, stations(name)')
      .eq('user_id', userId);
    
    // Execute a consulta com tratamento seguro para métodos encadeados
    let result;
    
    try {
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        // Formatar os dados para o formato esperado
        return data.map(item => ({
          id: item.id,
          stationId: item.station_id,
          stationName: item.stations?.name || "Estação Desconhecida",
          date: item.date,
          duration: item.duration,
          energy: item.energy,
          cost: item.cost,
          status: item.status
        }));
      }
    } catch (error) {
      console.error('Erro na consulta do Supabase:', error);
      throw error;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao carregar histórico do Supabase:', error);
    throw error;
  }
};

// Carregar histórico do localStorage
export const loadHistoryFromLocalStorage = (): ChargingSession[] => {
  try {
    const storedHistory = localStorage.getItem('chargingHistory');
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('Erro ao carregar histórico do localStorage:', error);
  }
  
  // Se não existir histórico ou ocorrer erro, criar alguns registros simulados
  const mockSessions = generateMockSessions(3);
  saveHistoryToLocalStorage(mockSessions);
  return mockSessions;
};

// Salvar histórico no localStorage
export const saveHistoryToLocalStorage = (sessions: ChargingSession[]): void => {
  try {
    localStorage.setItem('chargingHistory', JSON.stringify(sessions));
  } catch (error) {
    console.error('Erro ao salvar histórico no localStorage:', error);
  }
};

// Salvar novo carregamento no Supabase
export const saveChargingToSupabase = async (
  userId: string,
  newSession: ChargingSession
): Promise<void> => {
  try {
    const { error } = await supabase.from('charging_history').insert({
      user_id: userId,
      station_id: newSession.stationId,
      date: newSession.date,
      duration: newSession.duration,
      energy: newSession.energy,
      cost: newSession.cost,
      status: newSession.status
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao salvar carregamento no Supabase:', error);
    toast.error('Erro ao registrar carregamento. Tente novamente.');
    throw error;
  }
};
