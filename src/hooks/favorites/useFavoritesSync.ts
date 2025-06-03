
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncQueue } from '@/lib/syncQueue';
import { useSyncStatus, processQueueWithConnectedUser } from '@/lib/syncService';
import { isSupabaseConnected } from '@/lib/supabase';
import { loadFavoritesFromSupabase, saveFavoritesToLocalStorage } from './favoritesService';
import { Station } from '@/types/Station';

export function useFavoritesSync(
  setFavorites: (favorites: Station[]) => void,
  isVisitor: boolean
) {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { isSyncing, setIsSyncing, setLastSyncAttempt, setLastSuccessfulSync } = useSyncStatus();

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
  }, [user, isOnline, isVisitor, isSyncing, setIsSyncing, setLastSyncAttempt, setLastSuccessfulSync, setFavorites]);

  return {
    isSyncing,
    isOnline,
    lastSyncAttempt: useSyncStatus.getState().lastSyncAttempt,
    lastSuccessfulSync: useSyncStatus.getState().lastSuccessfulSync
  };
}
