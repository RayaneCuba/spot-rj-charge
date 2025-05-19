
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ChargingSession {
  id: number;
  stationName: string;
  date: string;
  duration: number; // em minutos
  energy: number; // em kWh
  cost: number; // em reais
  status: "completo" | "interrompido" | "em andamento";
}

export function ChargingHistory() {
  // Mock de histórico de carregamentos - será substituído por dados reais posteriormente
  const sessions: ChargingSession[] = [
    {
      id: 1,
      stationName: "Eletroposto Shopping Rio Sul",
      date: "2023-05-18",
      duration: 45,
      energy: 32.5,
      cost: 62.8,
      status: "completo"
    },
    {
      id: 2,
      stationName: "Eletroposto Barra Shopping",
      date: "2023-05-15",
      duration: 30,
      energy: 18.2,
      cost: 35.5,
      status: "completo"
    },
    {
      id: 3,
      stationName: "Eletroposto Estacionamento Gávea",
      date: "2023-05-10",
      duration: 15,
      energy: 8.5,
      cost: 16.9,
      status: "interrompido"
    }
  ];

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
