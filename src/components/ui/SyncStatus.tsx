
import { useEffect, useState } from 'react';
import { Wifi, WifiOff, Clock, Check } from 'lucide-react';
import { useNetworkStatus } from '@/lib/networkStatus';
import { useSyncQueue } from '@/lib/syncQueue';

export interface SyncStatusProps {
  lastSyncAttempt: number | null;
  lastSuccessfulSync: number | null;
  isSyncing: boolean;
  className?: string;
}

export function SyncStatus({ 
  lastSyncAttempt, 
  lastSuccessfulSync, 
  isSyncing,
  className 
}: SyncStatusProps) {
  const { isOnline } = useNetworkStatus();
  const [timeAgo, setTimeAgo] = useState<string>('');
  const { operations } = useSyncQueue();
  
  const pendingCount = operations.filter(
    op => op.syncStatus === 'pending' || op.syncStatus === 'failed'
  ).length;

  // Atualizar o tempo desde a última sincronização
  useEffect(() => {
    if (!lastSuccessfulSync) return;
    
    const updateTimeAgo = () => {
      const seconds = Math.floor((Date.now() - lastSuccessfulSync) / 1000);
      
      if (seconds < 60) {
        setTimeAgo('agora');
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m atrás`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h atrás`);
      } else {
        const days = Math.floor(seconds / 86400);
        setTimeAgo(`${days}d atrás`);
      }
    };
    
    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [lastSuccessfulSync]);

  return (
    <div className={`flex items-center text-xs ${className}`}>
      {isOnline ? (
        <Wifi className="h-3 w-3 text-green-500 mr-1" />
      ) : (
        <WifiOff className="h-3 w-3 text-amber-500 mr-1" />
      )}
      
      <span className={`${isOnline ? 'text-green-500' : 'text-amber-500'} mr-2`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
      
      {pendingCount > 0 && (
        <span className="bg-amber-100 text-amber-800 px-1 rounded mr-2">
          {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
        </span>
      )}
      
      {isSyncing && (
        <span className="flex items-center text-blue-500 animate-pulse">
          <Clock className="h-3 w-3 mr-1" />
          Sincronizando...
        </span>
      )}
      
      {!isSyncing && lastSuccessfulSync && (
        <span className="flex items-center text-gray-500">
          <Check className="h-3 w-3 mr-1 text-green-500" />
          Sincronizado {timeAgo}
        </span>
      )}
    </div>
  );
}
