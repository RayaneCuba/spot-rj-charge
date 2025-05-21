
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  loadFavoritesFromSupabase, 
  loadFavoritesFromLocalStorage,
  saveFavoritesToLocalStorage,
} from './favoritesService';
import { isStationFavorite } from './favoritesUtils';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncQueue } from '@/lib/syncQueue';
import { useSyncStatus, processQueueWithConnectedUser } from '@/lib/syncService';
import { getFavoritesByUserType } from './favoritesService';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVisitor } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { addOperation } = useSyncQueue();
  const { isSyncing, setIsSyncing, setLastSyncAttempt, setLastSuccessfulSync } = useSyncStatus();

  // Carregar favoritos do Supabase, localStorage ou mock para visitante
  useEffect(() => {
    const loadFavorites = async () => {
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
    };

    loadFavorites();
  }, [user, isVisitor, isOnline]);

  // Sincronizar fila quando o usuário estiver online
  useEffect(() => {
    // Não fazer nada se estiver no modo visitante
    if (isVisitor) return;
    
    // Não fazer nada se não houver usuário
    if (!user) return;
    
    // Não tentar sincronizar se offline
    if (!isOnline) return;
    
    // Processar a fila de sincronização ao ficar online
    const syncQueue = async () => {
      try {
        if (isSyncing) return; // Prevenir execuções simultâneas
        
        setIsSyncing(true);
        setLastSyncAttempt(Date.now());
        
        const result = await processQueueWithConnectedUser(user.id);
        
        if (result.processedCount > 0 && result.errorCount === 0) {
          setLastSuccessfulSync(Date.now());
          
          // Recarregar dados do servidor após sincronização bem-sucedida
          if (isSupabaseConnected()) {
            const updatedFavorites = await loadFavoritesFromSupabase(user.id);
            setFavorites(updatedFavorites);
            saveFavoritesToLocalStorage(updatedFavorites);
          }
        }
      } catch (error) {
        console.error("Erro ao processar fila de sincronização:", error);
      } finally {
        setIsSyncing(false);
      }
    };
    
    // Executar sincronização quando ficar online
    syncQueue();
    
    // Configurar intervalo de verificação periódica
    const interval = setInterval(syncQueue, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [user, isOnline, isVisitor]);

  // Verificar se uma estação é favorita
  const isFavorite = (stationId: number): boolean => {
    return isStationFavorite(favorites, stationId);
  };

  // Adicionar estação aos favoritos
  const addFavorite = async (station: Station) => {
    if (!isFavorite(station.id)) {
      // Adicionar ao estado para UI imediata
      setFavorites(prev => [...prev, station]);
      
      // Salvar no localStorage para persistência local
      saveFavoritesToLocalStorage([...favorites, station]);
      
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
  };

  // Remover estação dos favoritos
  const removeFavorite = async (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (station) {
      // Remover do estado para UI imediata
      setFavorites(prev => prev.filter(station => station.id !== stationId));
      
      // Atualizar localStorage
      saveFavoritesToLocalStorage(favorites.filter(s => s.id !== stationId));
      
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
    toggleFavorite,
    syncStatus: {
      isSyncing,
      isOnline,
      lastSyncAttempt: useSyncStatus.getState().lastSyncAttempt,
      lastSuccessfulSync: useSyncStatus.getState().lastSuccessfulSync
    }
  };
}
