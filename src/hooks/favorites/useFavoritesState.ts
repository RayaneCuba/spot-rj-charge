
import { useState, useEffect, useRef } from 'react';
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
  const hasMountedRef = useRef(false);

  // Carregar favoritos apenas uma vez na montagem
  useEffect(() => {
    // Prevenir execução múltipla
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;
    
    let isMounted = true;
    
    const loadFavorites = async () => {
      setIsLoading(true);
      
      try {
        let favoritesToLoad: Station[] = [];
        
        if (isVisitor) {
          // Usar dados mockados para visitante
          favoritesToLoad = getFavoritesByUserType(true);
        } else if (user?.id && isSupabaseConnected() && isOnline) {
          // Se o usuário estiver logado, online e o Supabase conectado
          favoritesToLoad = await loadFavoritesFromSupabase(user.id);
          // Salvar no localStorage como cache
          saveFavoritesToLocalStorage(favoritesToLoad);
        } else {
          // Fallback para localStorage
          favoritesToLoad = loadFavoritesFromLocalStorage();
        }
        
        if (isMounted) {
          setFavorites(favoritesToLoad);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        if (isMounted) {
          toast.error('Não foi possível carregar suas estações favoritas');
          // Fallback para localStorage
          try {
            const storedFavorites = loadFavoritesFromLocalStorage();
            setFavorites(storedFavorites);
          } catch (fallbackError) {
            console.error('Erro no fallback:', fallbackError);
            setFavorites([]);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFavorites();
    
    return () => {
      isMounted = false;
    };
  }, []); // Dependências vazias para executar apenas uma vez

  // Função estável para atualizar favoritos
  const updateFavorites = (newFavorites: Station[] | ((prev: Station[]) => Station[])) => {
    setFavorites(newFavorites);
  };

  return {
    favorites,
    updateFavorites,
    isLoading,
    isVisitor
  };
}
