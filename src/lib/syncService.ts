
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { useNetworkStatus, checkActualConnectivity } from './networkStatus';
import { useSyncQueue, processSyncQueue, SyncOperation } from './syncQueue';
import { toast } from 'sonner';

// Função para sincronizar favoritos
export const syncFavorites = async (userId: string, operation: SyncOperation) => {
  if (!isSupabaseConnected()) {
    throw new Error('Supabase não está conectado');
  }

  const { action, data } = operation;

  switch (action) {
    case 'create':
      await supabase.from('favorites').insert({
        user_id: userId,
        station_id: data.stationId,
        created_at: new Date(operation.timestamp).toISOString()
      });
      break;
      
    case 'delete':
      const deleteOperation = supabase.from('favorites').delete();
      
      if (typeof deleteOperation.eq === 'function') {
        try {
          const firstEqResult = deleteOperation.eq('user_id', userId);
          if (typeof firstEqResult.eq === 'function') {
            await firstEqResult.eq('station_id', data.stationId);
          }
        } catch (error) {
          console.error('Erro ao encadear métodos de deleção:', error);
          throw error;
        }
      }
      break;

    default:
      throw new Error(`Ação não suportada: ${action}`);
  }

  return true;
};

// Função para sincronizar histórico de carregamento
export const syncChargingHistory = async (userId: string, operation: SyncOperation) => {
  if (!isSupabaseConnected()) {
    throw new Error('Supabase não está conectado');
  }

  const { action, data } = operation;

  switch (action) {
    case 'create':
      await supabase.from('charging_history').insert({
        user_id: userId,
        station_id: data.stationId,
        date: data.date,
        duration: data.duration,
        energy: data.energy,
        cost: data.cost,
        status: data.status,
        created_at: new Date(operation.timestamp).toISOString()
      });
      break;
      
    case 'update':
      // Implementação de atualização do histórico
      break;
      
    case 'delete':
      // Implementação de exclusão do histórico
      break;

    default:
      throw new Error(`Ação não suportada: ${action}`);
  }

  return true;
};

// Função para sincronizar preferências do usuário
export const syncPreferences = async (userId: string, operation: SyncOperation) => {
  if (!isSupabaseConnected()) {
    throw new Error('Supabase não está conectado');
  }

  // Implementação específica para preferências do usuário
  return true;
};

// Processador principal da fila
export const processQueueWithConnectedUser = async (userId: string) => {
  const { getPendingOperations, updateOperationStatus, removeOperation } = useSyncQueue.getState();
  const { isOnline } = useNetworkStatus.getState();
  
  if (!isOnline) {
    console.log('Dispositivo offline. Sincronização adiada.');
    return { processedCount: 0, errorCount: 0 };
  }

  // Verificar conectividade real antes de prosseguir
  const actuallyOnline = await checkActualConnectivity();
  if (!actuallyOnline) {
    console.log('Verificação de conectividade falhou. Adiando sincronização.');
    useNetworkStatus.getState().setIsOnline(false);
    return { processedCount: 0, errorCount: 0 };
  }

  const pendingOperations = getPendingOperations();
  
  let processedCount = 0;
  let errorCount = 0;
  
  for (const operation of pendingOperations) {
    try {
      updateOperationStatus(operation.id, 'processing');
      
      switch (operation.entity) {
        case 'favorites':
          await syncFavorites(userId, operation);
          break;
        case 'chargingHistory':
          await syncChargingHistory(userId, operation);
          break;
        case 'preferences':
          await syncPreferences(userId, operation);
          break;
        default:
          throw new Error(`Entidade desconhecida: ${operation.entity}`);
      }
      
      updateOperationStatus(operation.id, 'completed');
      processedCount++;
    } catch (error: any) {
      console.error(`Erro ao sincronizar ${operation.entity}:`, error);
      
      // Incrementar contador de tentativas
      if (operation.retryCount >= 3) {
        // Após 3 tentativas, marcar como falha permanente
        toast.error(`Falha ao sincronizar dados. Tente novamente mais tarde.`);
      }
      
      updateOperationStatus(operation.id, 'failed', error.message);
      errorCount++;
    }
  }

  // Mostrar feedback visual das sincronizações
  if (processedCount > 0 && errorCount === 0) {
    toast.success(`${processedCount} itens sincronizados com sucesso`);
  } else if (processedCount > 0 && errorCount > 0) {
    toast.warning(`${processedCount} sincronizações concluídas, ${errorCount} com problemas`);
  } else if (processedCount === 0 && errorCount > 0) {
    toast.error(`Falha ao sincronizar ${errorCount} itens`);
  }
  
  return { processedCount, errorCount };
};

// Hook para gerenciar status de sincronização
export const useSyncStatus = create<{
  isSyncing: boolean;
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
  setIsSyncing: (status: boolean) => void;
  setLastSyncAttempt: (timestamp: number) => void;
  setLastSuccessfulSync: (timestamp: number) => void;
}>((set) => ({
  isSyncing: false,
  lastSyncAttempt: null,
  lastSuccessfulSync: null,
  setIsSyncing: (status) => set({ isSyncing: status }),
  setLastSyncAttempt: (timestamp) => set({ lastSyncAttempt: timestamp }),
  setLastSuccessfulSync: (timestamp) => set({ lastSuccessfulSync: timestamp }),
}));
