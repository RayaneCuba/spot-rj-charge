
import { useCallback } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncQueue } from '@/lib/syncQueue';
import { processQueueWithConnectedUser } from '@/lib/syncService';
import { saveFavoritesToLocalStorage } from './favoritesService';
import { isStationFavorite } from './favoritesUtils';

export function useFavoritesOperations(
  favorites: Station[],
  updateFavorites: (favorites: Station[] | ((prev: Station[]) => Station[])) => void,
  isVisitor: boolean
) {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { addOperation } = useSyncQueue();

  // Verificar se uma estação é favorita
  const isFavorite = useCallback((stationId: number): boolean => {
    return isStationFavorite(favorites, stationId);
  }, [favorites]);

  // Adicionar estação aos favoritos
  const addFavorite = useCallback(async (station: Station) => {
    if (isStationFavorite(favorites, station.id)) {
      return; // Já é favorita
    }

    // Atualizar estado local imediatamente
    const newFavorites = [...favorites, station];
    updateFavorites(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
    
    if (isVisitor) {
      toast("Modo Visitante", {
        description: "Esta ação não será salva permanentemente."
      });
      return;
    }
    
    if (user?.id) {
      // Adicionar à fila de sincronização
      addOperation({
        entity: 'favorites',
        action: 'create',
        data: { stationId: station.id },
        userId: user.id
      });
      
      // Tentar sincronizar se online
      if (isOnline && isSupabaseConnected()) {
        try {
          await processQueueWithConnectedUser(user.id);
        } catch (error) {
          console.error('Erro ao sincronizar:', error);
          toast("Modo Offline", {
            description: "Será sincronizado quando online."
          });
        }
      } else {
        toast("Modo Offline", {
          description: "Favoritado localmente. Será sincronizado quando online."
        });
      }
    }
    
    toast.success(`${station.name} adicionada aos favoritos`);
  }, [favorites, updateFavorites, isVisitor, user?.id, isOnline, addOperation]);

  // Remover estação dos favoritos
  const removeFavorite = useCallback(async (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (!station) return;

    // Atualizar estado local imediatamente
    const newFavorites = favorites.filter(s => s.id !== stationId);
    updateFavorites(newFavorites);
    saveFavoritesToLocalStorage(newFavorites);
    
    if (isVisitor) {
      toast("Modo Visitante", {
        description: "Esta ação não será salva permanentemente."
      });
      return;
    }
    
    if (user?.id) {
      // Adicionar à fila de sincronização
      addOperation({
        entity: 'favorites',
        action: 'delete',
        data: { stationId },
        userId: user.id
      });
      
      // Tentar sincronizar se online
      if (isOnline && isSupabaseConnected()) {
        try {
          await processQueueWithConnectedUser(user.id);
        } catch (error) {
          console.error('Erro ao sincronizar:', error);
          toast("Modo Offline", {
            description: "Será sincronizado quando online."
          });
        }
      } else {
        toast("Modo Offline", {
          description: "Removido localmente. Será sincronizado quando online."
        });
      }
    }
    
    toast.success(`${station.name} removida dos favoritos`);
  }, [favorites, updateFavorites, isVisitor, user?.id, isOnline, addOperation]);

  // Toggle favorito
  const toggleFavorite = useCallback((station: Station) => {
    if (isStationFavorite(favorites, station.id)) {
      removeFavorite(station.id);
    } else {
      addFavorite(station);
    }
  }, [favorites, removeFavorite, addFavorite]);

  return {
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
