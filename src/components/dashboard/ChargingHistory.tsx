
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useChargingHistory } from "@/hooks/useChargingHistory";
import { ChargingHistoryHeader } from "./charging-history/ChargingHistoryHeader";
import { SessionsList } from "./charging-history/SessionsList";

export function ChargingHistory() {
  const { getRecentSessions, syncStatus } = useChargingHistory();
  const sessions = getRecentSessions(5); // Pegar até 5 sessões mais recentes

  return (
    <Card>
      <CardHeader className="pb-3">
        <ChargingHistoryHeader syncStatus={syncStatus} />
      </CardHeader>
      <CardContent>
        <SessionsList sessions={sessions} />
      </CardContent>
    </Card>
  );
}
