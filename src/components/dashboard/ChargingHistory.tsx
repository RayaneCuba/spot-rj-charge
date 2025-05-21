
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useChargingHistory } from "@/hooks/useChargingHistory";
import { ChargingHistoryHeader } from "./charging-history/ChargingHistoryHeader";
import { SessionsList } from "./charging-history/SessionsList";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/auth";

export function ChargingHistory() {
  const { getRecentSessions, syncStatus } = useChargingHistory();
  const { user } = useAuth();
  
  const { 
    data: sessions, 
    isLoading, 
    error,
    retry
  } = useAsync(
    async () => {
      // Em produção, isso buscaria do backend ou cache local
      return getRecentSessions(5);
    },
    {
      // Configurações para chamada
      errorMessage: "Falha ao carregar histórico de carregamentos",
      autoRetry: true,
      maxRetries: 2,
    },
    [user?.id] // Recarregar quando o usuário mudar
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <ChargingHistoryHeader syncStatus={syncStatus} />
      </CardHeader>
      <CardContent>
        <SessionsList 
          sessions={sessions || []}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
        />
      </CardContent>
    </Card>
  );
}
