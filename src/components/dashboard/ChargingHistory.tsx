
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChargingHistory } from "@/hooks/useChargingHistory";

export function ChargingHistory() {
  const { getRecentSessions } = useChargingHistory();
  const sessions = getRecentSessions(5); // Pegar até 5 sessões mais recentes

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completo": return "bg-green-500";
      case "interrompido": return "bg-amber-500";
      case "em andamento": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Histórico de Carregamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map(session => (
              <div 
                key={session.id} 
                className="border-b border-border last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{session.stationName}</h4>
                    <p className="text-xs text-muted-foreground">{formatDate(session.date)}</p>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(session.status)} text-white`}>
                    {session.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 mt-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Tempo</span>
                    <p>{session.duration} min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Energia</span>
                    <p>{session.energy} kWh</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Custo</span>
                    <p>R$ {session.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Nenhum carregamento registrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
