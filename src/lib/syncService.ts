
import { create } from 'zustand';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { addFavoriteToSupabase, removeFavoriteFromSupabase } from '@/hooks/favorites/favoritesService';
import { useSyncQueue, SyncOperation } from './syncQueue';

interface SyncStatusState {
  isSyncing: boolean;
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
  setIsSyncing: (syncing: boolean) => void;
  setLastSyncAttempt: (timestamp: number) => void;
  setLastSuccessfulSync: (timestamp: number) => void;
}

export const useSyncStatus = create<SyncStatusState>((set) => ({
  isSyncing: false,
  lastSyncAttempt: null,
  lastSuccessfulSync: null,
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncAttempt: (timestamp) => set({ lastSyncAttempt: timestamp }),
  setLastSuccessfulSync: (timestamp) => set({ lastSuccessfulSync: timestamp }),
}));

// Processar fila de sincronização com usuário conectado
export const processQueueWithConnectedUser = async (userId: string) => {
  if (!isSupabaseConnected()) {
    console.log('Supabase não conectado, pulando sincronização');
    return { processedCount: 0, errorCount: 0 };
  }

  const { getPendingOperations, updateOperationStatus } = useSyncQueue.getState();
  const pendingOps = getPendingOperations();
  
  let processedCount = 0;
  let errorCount = 0;

  for (const operation of pendingOps) {
    try {
      updateOperationStatus(operation.id, 'processing');
      
      if (operation.entity === 'favorites') {
        if (operation.action === 'create') {
          await addFavoriteToSupabase(userId, operation.data.stationId);
        } else if (operation.action === 'delete') {
          await removeFavoriteFromSupabase(userId, operation.data.stationId);
        }
      }
      
      updateOperationStatus(operation.id, 'completed');
      processedCount++;
      
    } catch (error: any) {
      console.error(`Erro ao processar operação ${operation.id}:`, error);
      updateOperationStatus(operation.id, 'failed', error.message);
      errorCount++;
    }
  }

  return { processedCount, errorCount };
};
