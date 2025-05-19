
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface StationCardProps {
  station: {
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    distance?: number;
    availability?: "disponível" | "ocupado" | "offline";
    connectorTypes?: string[];
  };
  isSelected: boolean;
  onClick: (id: number) => void;
  onRouteClick?: (id: number) => void;
}

export function StationCard({ station, isSelected, onClick, onRouteClick }: StationCardProps) {
  const handleRouteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRouteClick) {
      onRouteClick(station.id);
    }
  };

  return (
    <Card 
      key={station.id} 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-primary' : ''}`}
      onClick={() => onClick(station.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className={`h-5 w-5 mt-1 ${isSelected ? 'text-primary' : 'text-secondary'}`} />
          <div className="w-full">
            <h3 className="font-montserrat font-semibold text-lg">{station.name}</h3>
            <p className="text-muted-foreground text-sm">{station.city}</p>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span>{station.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horário:</span>
                <span>{station.hours}</span>
              </div>
              {station.distance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distância:</span>
                  <span>{station.distance.toFixed(1)} km</span>
                </div>
              )}
              {station.availability && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`${
                    station.availability === "disponível" ? "text-green-500" :
                    station.availability === "ocupado" ? "text-amber-500" : "text-gray-500"
                  }`}>
                    {station.availability}
                  </span>
                </div>
              )}
            </div>
            
            {onRouteClick && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full" 
                onClick={handleRouteClick}
              >
                <Navigation className="mr-1 h-4 w-4" /> Traçar Rota
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
