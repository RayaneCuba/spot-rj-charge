
import { useEffect, useCallback, useRef } from 'react';
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
  const syncInProgress = useRef(false);

  // Memoize the sync function to prevent re-creation on every render
  const syncQueue = useCallback(async () => {
    // Não fazer nada se estiver no modo visitante
    if (isVisitor) return;
    
    // Não fazer nada se não houver usuário
    if (!user) return;
    
    // Não tentar sincronizar se offline
    if (!isOnline) return;

    // Prevenir execuções simultâneas
    if (syncInProgress.current || isSyncing) return;
    
    try {
      syncInProgress.current = true;
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
      syncInProgress.current = false;
      setIsSyncing(false);
    }
  }, [user?.id, isOnline, isVisitor, isSyncing, setIsSyncing, setLastSyncAttempt, setLastSuccessfulSync, setFavorites]);

  // Sincronizar fila quando o usuário estiver online
  useEffect(() => {
    // Executar sincronização quando ficar online
    if (isOnline && user && !isVisitor && !syncInProgress.current && !isSyncing) {
      const timeoutId = setTimeout(() => {
        syncQueue();
      }, 100); // Small delay to prevent immediate execution
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, user?.id, isVisitor, isSyncing, syncQueue]);

  // Configurar intervalo de verificação periódica
  useEffect(() => {
    if (!user || isVisitor || !isOnline) return;
    
    const interval = setInterval(() => {
      if (!syncInProgress.current && !isSyncing) {
        syncQueue();
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [user?.id, isVisitor, isOnline, isSyncing, syncQueue]);

  return {
    isSyncing,
    isOnline,
    lastSyncAttempt: useSyncStatus.getState().lastSyncAttempt,
    lastSuccessfulSync: useSyncStatus.getState().lastSuccessfulSync
  };
}
