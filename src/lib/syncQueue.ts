
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncOperation = {
  id: string;
  entity: 'favorites' | 'chargingHistory' | 'preferences';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  userId?: string;
  retryCount: number;
  syncStatus: 'pending' | 'processing' | 'failed' | 'completed';
};

interface SyncQueueState {
  operations: SyncOperation[];
  addOperation: (operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'syncStatus'>) => void;
  updateOperationStatus: (id: string, status: SyncOperation['syncStatus'], error?: string) => void;
  removeOperation: (id: string) => void;
  getPendingOperations: (entity?: SyncOperation['entity']) => SyncOperation[];
  clearCompletedOperations: () => void;
}

// Store persistente para a fila de sincronização
export const useSyncQueue = create<SyncQueueState>()(
  persist(
    (set, get) => ({
      operations: [],
      
      // Adicionar uma operação à fila
      addOperation: (operation) => set((state) => {
        const newOperation: SyncOperation = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          retryCount: 0,
          syncStatus: 'pending',
          ...operation,
        };
        
        return {
          operations: [...state.operations, newOperation]
        };
      }),
      
      // Atualizar o status de uma operação
      updateOperationStatus: (id, status, error) => set((state) => ({
        operations: state.operations.map(op => 
          op.id === id ? { 
            ...op, 
            syncStatus: status, 
            retryCount: status === 'failed' ? op.retryCount + 1 : op.retryCount,
            error: error
          } : op
        )
      })),
      
      // Remover uma operação da fila
      removeOperation: (id) => set((state) => ({
        operations: state.operations.filter(op => op.id !== id)
      })),
      
      // Obter todas as operações pendentes
      getPendingOperations: (entity) => {
        const { operations } = get();
        return operations.filter(op => 
          (op.syncStatus === 'pending' || op.syncStatus === 'failed') && 
          (!entity || op.entity === entity)
        );
      },
      
      // Limpar operações concluídas
      clearCompletedOperations: () => set((state) => ({
        operations: state.operations.filter(op => op.syncStatus !== 'completed')
      })),
    }),
    {
      name: 'electrospot-sync-queue',
    }
  )
);

// Processador de fila de sincronização
export const processSyncQueue = async () => {
  const { operations, updateOperationStatus, removeOperation } = useSyncQueue.getState();
  const pendingOps = operations.filter(op => op.syncStatus === 'pending' || (op.syncStatus === 'failed' && op.retryCount < 3));
  
  console.log(`Processando fila de sincronização: ${pendingOps.length} operações pendentes`);
  
  // Processar operações pendentes quando online
  for (const operation of pendingOps) {
    try {
      updateOperationStatus(operation.id, 'processing');

      // Implementação real na próxima etapa
      console.log(`Sincronizando operação ${operation.id} - ${operation.entity} - ${operation.action}`);
      
      // Simular sucesso/falha para testar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Quando a sincronização for bem-sucedida
      updateOperationStatus(operation.id, 'completed');
      
    } catch (error: any) {
      console.error(`Erro ao sincronizar operação ${operation.id}:`, error);
      updateOperationStatus(operation.id, 'failed', error.message);
    }
  }
};
