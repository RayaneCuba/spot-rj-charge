
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Station } from "@/types/Station";
import { chargingStations } from "@/data/stations";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useFavorites } from "@/hooks/useFavorites";
import { useChargingHistory } from "@/hooks/useChargingHistory";

export function NearbyStations() {
  const navigate = useNavigate();
  const { userLocation } = useUserLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { simulateCharging } = useChargingHistory();
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);

  // Calcular distância entre coordenadas (usando a fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  useEffect(() => {
    if (userLocation) {
      const [userLat, userLng] = userLocation;
      
      // Adicionar distância a cada estação
      const stationsWithDistance = chargingStations.map(station => {
        const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
        return { ...station, distance };
      });
      
      // Ordenar por distância e pegar as 3 mais próximas
      const closest = [...stationsWithDistance]
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 3);
      
      setNearbyStations(closest);
    } else {
      // Se não houver localização, mostrar 3 estações aleatórias
      setNearbyStations(chargingStations.slice(0, 3));
    }
  }, [userLocation]);

  const handleViewAllClick = () => {
    navigate("/");
  };

  const handleFavoriteToggle = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  const handleSimulateCharging = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    simulateCharging(station);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-500" />
            Estações Próximas
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleViewAllClick}
            className="text-xs"
          >
            Ver mapa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {nearbyStations.length > 0 ? (
          <div className="space-y-4">
            {nearbyStations.map(station => (
              <div 
                key={station.id} 
                className="border-b border-border last:border-0 pb-4 last:pb-0 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{station.name}</h4>
                    <p className="text-xs text-muted-foreground">{station.city}</p>
                  </div>
                  <div className="text-xs font-medium">
                    {station.distance !== undefined && (
                      <span className="text-green-600">{station.distance.toFixed(1)} km</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={(e) => handleFavoriteToggle(station, e)}
                  >
                    {isFavorite(station.id) ? "Remover favorito" : "Adicionar favorito"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={(e) => handleSimulateCharging(station, e)}
                  >
                    Simular carregamento
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Nenhuma estação próxima encontrada.</p>
            <p className="text-xs mt-1">Habilite sua localização para ver estações próximas.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
