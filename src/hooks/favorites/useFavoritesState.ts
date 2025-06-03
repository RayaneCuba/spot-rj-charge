
import { useState, useEffect, useCallback } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/lib/networkStatus';
import { 
  loadFavoritesFromSupabase, 
  loadFavoritesFromLocalStorage,
  saveFavoritesToLocalStorage,
  getFavoritesByUserType
} from './favoritesService';

export function useFavoritesState() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVisitor } = useAuth();
  const { isOnline } = useNetworkStatus();

  // Memoize the loadFavorites function to prevent re-creation
  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isVisitor) {
        // Usar dados mockados para visitante
        setFavorites(getFavoritesByUserType(true));
      } else if (user && isSupabaseConnected() && isOnline) {
        // Se o usuário estiver logado, online e o Supabase conectado, carregar do Supabase
        const formattedStations = await loadFavoritesFromSupabase(user.id);
        setFavorites(formattedStations);
        
        // Salvar também no localStorage como cache
        saveFavoritesToLocalStorage(formattedStations);
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
  }, [user?.id, isVisitor, isOnline]);

  // Carregar favoritos do Supabase, localStorage ou mock para visitante
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    setFavorites,
    isLoading,
    isVisitor
  };
}
