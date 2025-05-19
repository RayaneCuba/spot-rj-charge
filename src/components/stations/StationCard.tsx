
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { Station } from "@/types/Station";
import { useChargingHistory } from "@/hooks/useChargingHistory";

interface StationCardProps {
  station: Station;
  isSelected: boolean;
  onClick: (id: number) => void;
  onRouteClick?: (id: number) => void;
}

export function StationCard({ station, isSelected, onClick, onRouteClick }: StationCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { simulateCharging } = useChargingHistory();
  
  const isFav = isFavorite(station.id);

  const handleRouteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRouteClick) {
      onRouteClick(station.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  const handleSimulateCharging = (e: React.MouseEvent) => {
    e.stopPropagation();
    simulateCharging(station);
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
            <div className="flex justify-between items-start">
              <h3 className="font-montserrat font-semibold text-lg">{station.name}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-6 w-6 ${isFav ? 'text-amber-500' : 'text-muted-foreground'} hover:text-amber-600`}
                onClick={handleFavoriteClick}
              >
                <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
              </Button>
            </div>
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
            
            <div className="mt-3 flex gap-2">
              {onRouteClick && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1" 
                  onClick={handleRouteClick}
                >
                  <Navigation className="mr-1 h-4 w-4" /> Rota
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={handleSimulateCharging}
              >
                Simular carregamento
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
