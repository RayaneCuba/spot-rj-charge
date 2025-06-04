
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncStatus, processQueueWithConnectedUser } from '@/lib/syncService';
import { isSupabaseConnected } from '@/lib/supabase';
import { loadFavoritesFromSupabase, saveFavoritesToLocalStorage } from './favoritesService';
import { Station } from '@/types/Station';

export function useFavoritesSync(
  updateFavorites: (favorites: Station[] | ((prev: Station[]) => Station[])) => void,
  isVisitor: boolean
) {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { isSyncing, setIsSyncing, setLastSyncAttempt, setLastSuccessfulSync } = useSyncStatus();
  const syncInProgress = useRef(false);
  const lastSyncTimestamp = useRef(0);

  // Sincronizar apenas quando necessário
  useEffect(() => {
    // Não sincronizar se for visitante ou não houver usuário
    if (isVisitor || !user?.id || !isOnline) return;
    
    // Prevenir sincronizações muito frequentes
    const now = Date.now();
    if (now - lastSyncTimestamp.current < 5000) return; // Mínimo 5 segundos entre sincronizações
    
    // Prevenir execuções simultâneas
    if (syncInProgress.current || isSyncing) return;
    
    const syncQueue = async () => {
      try {
        syncInProgress.current = true;
        setIsSyncing(true);
        setLastSyncAttempt(now);
        lastSyncTimestamp.current = now;
        
        const result = await processQueueWithConnectedUser(user.id);
        
        if (result.processedCount > 0 && result.errorCount === 0) {
          setLastSuccessfulSync(now);
          
          // Recarregar dados do servidor após sincronização bem-sucedida
          if (isSupabaseConnected()) {
            const updatedFavorites = await loadFavoritesFromSupabase(user.id);
            updateFavorites(updatedFavorites);
            saveFavoritesToLocalStorage(updatedFavorites);
          }
        }
      } catch (error) {
        console.error("Erro ao sincronizar:", error);
      } finally {
        syncInProgress.current = false;
        setIsSyncing(false);
      }
    };

    // Executar sincronização com pequeno delay
    const timeoutId = setTimeout(syncQueue, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [isOnline, user?.id, isVisitor]); // Dependências mínimas e estáveis

  // Sincronização periódica
  useEffect(() => {
    if (!user?.id || isVisitor || !isOnline) return;
    
    const interval = setInterval(() => {
      // Verificar se não há sincronização em andamento
      if (!syncInProgress.current && !isSyncing) {
        const now = Date.now();
        if (now - lastSyncTimestamp.current > 300000) { // 5 minutos
          // Disparar nova sincronização
          lastSyncTimestamp.current = 0; // Reset para permitir nova sincronização
        }
      }
    }, 60000); // Verificar a cada minuto
    
    return () => clearInterval(interval);
  }, [user?.id, isVisitor, isOnline, isSyncing]);

  return {
    isSyncing,
    isOnline,
    lastSyncAttempt: useSyncStatus.getState().lastSyncAttempt,
    lastSuccessfulSync: useSyncStatus.getState().lastSuccessfulSync
  };
}
