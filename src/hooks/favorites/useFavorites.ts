
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  loadFavoritesFromSupabase, 
  loadFavoritesFromLocalStorage,
  saveFavoritesToLocalStorage,
  addFavoriteToSupabase,
  removeFavoriteFromSupabase,
  getFavoritesByUserType
} from './favoritesService';
import { isStationFavorite } from './favoritesUtils';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVisitor } = useAuth();

  // Carregar favoritos do Supabase, localStorage ou mock para visitante
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        if (isVisitor) {
          // Usar dados mockados para visitante
          setFavorites(getFavoritesByUserType(true));
        } else if (user && isSupabaseConnected()) {
          // Se o usuário estiver logado e o Supabase conectado, carregar do Supabase
          const formattedStations = await loadFavoritesFromSupabase(user.id);
          setFavorites(formattedStations);
        } else {
          // Caso contrário, usar localStorage como fallback
          const storedFavorites = loadFavoritesFromLocalStorage();
          setFavorites(storedFavorites);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Não foi possível carregar suas estações favoritas');
        
        // Tentar carregar do localStorage em caso de erro
        try {
          const storedFavorites = loadFavoritesFromLocalStorage();
          setFavorites(storedFavorites);
        } catch {} // Ignorar erros do fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, isVisitor]);

  // Salvar favoritos no localStorage quando mudar (fallback)
  useEffect(() => {
    if (!isLoading && !user && !isVisitor) {
      saveFavoritesToLocalStorage(favorites);
    }
  }, [favorites, isLoading, user, isVisitor]);

  // Verificar se uma estação é favorita
  const isFavorite = (stationId: number): boolean => {
    return isStationFavorite(favorites, stationId);
  };

  // Adicionar estação aos favoritos
  const addFavorite = async (station: Station) => {
    if (!isFavorite(station.id)) {
      // Adicionar ao estado para UI imediata
      setFavorites(prev => [...prev, station]);
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user && isSupabaseConnected()) {
        try {
          // Salvar no Supabase se o usuário estiver logado
          await addFavoriteToSupabase(user.id, station.id);
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
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user && isSupabaseConnected()) {
        try {
          // Remover do Supabase
          await removeFavoriteFromSupabase(user.id, stationId);
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
