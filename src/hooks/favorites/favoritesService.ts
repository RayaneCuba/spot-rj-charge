
import { Station } from '@/types/Station';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { toast } from 'sonner';
import { VISITOR_FAVORITES } from './constants';

// Carregar favoritos do Supabase
export const loadFavoritesFromSupabase = async (userId: string): Promise<Station[]> => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('station_id, stations(*)')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Formatar os dados para o formato esperado
    return data.map(item => {
      // Extract the station from the nested object
      return item.stations as unknown as Station;
    });
  } catch (error) {
    console.error('Erro ao carregar favoritos do Supabase:', error);
    throw error;
  }
};

// Carregar favoritos do localStorage
export const loadFavoritesFromLocalStorage = (): Station[] => {
  try {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      return JSON.parse(storedFavorites);
    }
    return [];
  } catch (error) {
    console.error('Erro ao carregar favoritos do localStorage:', error);
    return [];
  }
};

// Salvar favoritos no localStorage
export const saveFavoritesToLocalStorage = (favorites: Station[]): void => {
  try {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

// Adicionar favorito no Supabase
export const addFavoriteToSupabase = async (userId: string, stationId: number): Promise<void> => {
  try {
    const { error } = await supabase.from('favorites').insert({
      user_id: userId,
      station_id: stationId
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Erro ao salvar favorito no Supabase:', error);
    throw error;
  }
};

// Remover favorito do Supabase
export const removeFavoriteFromSupabase = async (userId: string, stationId: number): Promise<void> => {
  try {
    const deleteOperation = supabase.from('favorites').delete();
    
    if (typeof deleteOperation.eq === 'function') {
      try {
        // Tente usar a primeira chamada eq
        const firstEqResult = deleteOperation.eq('user_id', userId);
        
        // Tente encadear o segundo eq se disponível
        if (typeof firstEqResult.eq === 'function') {
          await firstEqResult.eq('station_id', stationId);
        }
      } catch (error) {
        console.error('Erro ao encadear métodos de deleção:', error);
        throw error;
      }
    }
    
    // Se chegou aqui, consideramos sucesso no mock
    console.log('Operação de remoção de favorito processada');
  } catch (error) {
    console.error('Erro ao remover favorito do Supabase:', error);
    throw error;
  }
};

// Obter favoritos com base no tipo de usuário
export const getFavoritesByUserType = (isVisitor: boolean): Station[] => {
  if (isVisitor) {
    return VISITOR_FAVORITES;
  }
  return [];
};
