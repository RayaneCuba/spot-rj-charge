
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Carregar favoritos do Supabase ou localStorage (fallback)
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Se o usuário estiver logado, carregar do Supabase
          const { data, error } = await supabase
            .from('favorites')
            .select('station_id, stations(*)')
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          if (data) {
            // Formatar os dados para o formato esperado
            const formattedStations: Station[] = data.map(item => item.stations as Station);
            setFavorites(formattedStations);
          }
        } else {
          // Caso contrário, usar localStorage como fallback
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Não foi possível carregar suas estações favoritas');
        
        // Tentar carregar do localStorage em caso de erro
        try {
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch {} // Ignorar erros do fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Salvar favoritos no localStorage quando mudar (fallback)
  useEffect(() => {
    if (!isLoading && !user) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading, user]);

  // Verificar se uma estação é favorita
  const isFavorite = (stationId: number): boolean => {
    return favorites.some(station => station.id === stationId);
  };

  // Adicionar estação aos favoritos
  const addFavorite = async (station: Station) => {
    if (!isFavorite(station.id)) {
      // Adicionar ao estado para UI imediata
      setFavorites(prev => [...prev, station]);
      
      if (user) {
        try {
          // Salvar no Supabase se o usuário estiver logado
          const { error } = await supabase.from('favorites').insert({
            user_id: user.id,
            station_id: station.id
          });
          
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao salvar favorito:', error);
          toast.error('Erro ao salvar favorito. Tente novamente.');
          // Reverter estado em caso de erro
          setFavorites(prev => prev.filter(s => s.id !== station.id));
          return;
        }
      }
      
      toast.success(`${station.name} adicionada aos favoritos`);
    }
  };

  // Remover estação dos favoritos
  const removeFavorite = async (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (station) {
      // Remover do estado para UI imediata
      setFavorites(prev => prev.filter(station => station.id !== stationId));
      
      if (user) {
        try {
          // Remover do Supabase se o usuário estiver logado
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('station_id', stationId);
          
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao remover favorito:', error);
          toast.error('Erro ao remover favorito. Tente novamente.');
          // Reverter estado em caso de erro
          setFavorites(prev => [...prev, station]);
          return;
        }
      }
      
      toast.success(`${station.name} removida dos favoritos`);
    }
  };

  // Toggle favorito
  const toggleFavorite = (station: Station) => {
    if (isFavorite(station.id)) {
      removeFavorite(station.id);
    } else {
      addFavorite(station);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
