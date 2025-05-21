
import { Badge } from "@/components/ui/badge";

interface SessionItemProps {
  session: {
    id: number;
    stationName: string;
    date: string;
    status: string;
    duration: number;
    energy: number;
    cost: number;
  };
}

export function SessionItem({ session }: SessionItemProps) {
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
    <div className="border-b border-border last:border-0 pb-4 last:pb-0">
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
  );
}
