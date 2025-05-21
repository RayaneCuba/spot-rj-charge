
import { Clock } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { SyncStatus } from "@/components/ui/SyncStatus";

interface ChargingHistoryHeaderProps {
  syncStatus: {
    isSyncing: boolean;
    lastSyncAttempt: number | null;
    lastSuccessfulSync: number | null;
  };
}

export function ChargingHistoryHeader({ syncStatus }: ChargingHistoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-500" />
        Histórico de Carregamentos
      </CardTitle>
      <SyncStatus 
        isSyncing={syncStatus.isSyncing}
        lastSyncAttempt={syncStatus.lastSyncAttempt}
        lastSuccessfulSync={syncStatus.lastSuccessfulSync}
        className="text-xs"
      />
    </div>
  );
}
