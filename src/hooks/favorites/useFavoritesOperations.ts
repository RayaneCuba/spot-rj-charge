
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
  setFavorites: (favorites: Station[]) => void,
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
    if (!isFavorite(station.id)) {
      // Adicionar ao estado para UI imediata
      const updatedFavorites = [...favorites, station];
      setFavorites(updatedFavorites);
      
      // Salvar no localStorage para persistência local
      saveFavoritesToLocalStorage(updatedFavorites);
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user) {
        // Salvar no Supabase se online, ou adicionar à fila de sincronização
        if (isOnline && isSupabaseConnected()) {
          try {
            // Adicionar operação à fila de sincronização
            addOperation({
              entity: 'favorites',
              action: 'create',
              data: { stationId: station.id },
              userId: user.id
            });
            
            // Iniciar sincronização imediata
            processQueueWithConnectedUser(user.id).catch(console.error);
          } catch (error) {
            console.error('Erro ao salvar favorito:', error);
            toast.error('Erro ao salvar favorito. Será sincronizado automaticamente quando online.');
          }
        } else {
          // Adicionar à fila para sincronização posterior quando offline
          addOperation({
            entity: 'favorites',
            action: 'create',
            data: { stationId: station.id },
            userId: user.id
          });
          
          toast("Modo Offline", {
            description: "Favoritado localmente. Será sincronizado quando online."
          });
        }
      }
      
      toast.success(`${station.name} adicionada aos favoritos`);
    }
  }, [favorites, isFavorite, setFavorites, isVisitor, user, isOnline, addOperation]);

  // Remover estação dos favoritos
  const removeFavorite = useCallback(async (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (station) {
      // Remover do estado para UI imediata
      const updatedFavorites = favorites.filter(station => station.id !== stationId);
      setFavorites(updatedFavorites);
      
      // Atualizar localStorage
      saveFavoritesToLocalStorage(updatedFavorites);
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user) {
        // Remover do Supabase ou adicionar à fila de sincronização
        if (isOnline && isSupabaseConnected()) {
          try {
            // Adicionar operação à fila de sincronização
            addOperation({
              entity: 'favorites',
              action: 'delete',
              data: { stationId },
              userId: user.id
            });
            
            // Iniciar sincronização imediata
            processQueueWithConnectedUser(user.id).catch(console.error);
          } catch (error) {
            console.error('Erro ao remover favorito:', error);
            toast.error('Erro ao remover favorito. Será sincronizado quando online.');
          }
        } else {
          // Adicionar à fila para sincronização posterior
          addOperation({
            entity: 'favorites',
            action: 'delete',
            data: { stationId },
            userId: user.id
          });
          
          toast("Modo Offline", {
            description: "Removido localmente. Será sincronizado quando online."
          });
        }
      }
      
      toast.success(`${station.name} removida dos favoritos`);
    }
  }, [favorites, setFavorites, isVisitor, user, isOnline, addOperation]);

  // Toggle favorito
  const toggleFavorite = useCallback((station: Station) => {
    if (isFavorite(station.id)) {
      removeFavorite(station.id);
    } else {
      addFavorite(station);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return {
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
