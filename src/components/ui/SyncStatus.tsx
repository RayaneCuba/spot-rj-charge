
import { Cloud, CloudOff, Loader2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SyncStatusProps {
  isSyncing: boolean;
  lastSyncAttempt?: number | null;
  lastSuccessfulSync?: number | null;
  isOnline?: boolean;
}

export function SyncStatus({ 
  isSyncing, 
  lastSyncAttempt, 
  lastSuccessfulSync,
  isOnline = true 
}: SyncStatusProps) {
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: <CloudOff className="h-3 w-3" />,
        text: "Offline",
        variant: "destructive" as const,
        tooltip: "Modo offline. Dados serão sincronizados quando voltar online."
      };
    }

    if (isSyncing) {
      return {
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        text: "Sincronizando",
        variant: "secondary" as const,
        tooltip: "Sincronizando dados com o servidor..."
      };
    }

    if (lastSuccessfulSync) {
      const timeDiff = Date.now() - lastSuccessfulSync;
      const minutes = Math.floor(timeDiff / (1000 * 60));
      
      return {
        icon: <CheckCircle className="h-3 w-3" />,
        text: minutes < 1 ? "Sincronizado" : `${minutes}min atrás`,
        variant: "default" as const,
        tooltip: `Última sincronização: ${new Date(lastSuccessfulSync).toLocaleTimeString()}`
      };
    }

    return {
      icon: <Cloud className="h-3 w-3" />,
      text: "Online",
      variant: "secondary" as const,
      tooltip: "Conectado ao servidor"
    };
  };

  const status = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={status.variant} className="text-xs gap-1">
            {status.icon}
            {status.text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
