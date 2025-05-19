
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StationList } from "@/components/stations/StationList";
import { useState, useEffect } from "react";
import { Station } from "@/types/Station";
import { useNavigate } from "react-router-dom";

export function NearbyStations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  
  // Mock para simular a busca de estações próximas
  useEffect(() => {
    // Simula carregamento de dados da API
    setTimeout(() => {
      setStations([
        {
          id: 101,
          name: "Eletroposto Ipanema",
          city: "Rio de Janeiro",
          lat: -22.983,
          lng: -43.198,
          type: "Rápido",
          hours: "24h",
          distance: 1.2,
          availability: "disponível",
          connectorTypes: ["Tipo 2", "CCS"]
        },
        {
          id: 102,
          name: "Eletroposto Leblon",
          city: "Rio de Janeiro",
          lat: -22.986,
          lng: -43.218,
          type: "Ultra-rápido",
          hours: "8h-22h",
          distance: 2.4,
          availability: "disponível",
          connectorTypes: ["CHAdeMO", "CCS"]
        },
        {
          id: 103,
          name: "Eletroposto Copacabana",
          city: "Rio de Janeiro",
          lat: -22.970,
          lng: -43.185,
          type: "Semi-rápido",
          hours: "24h",
          distance: 3.5,
          availability: "ocupado",
          connectorTypes: ["Tipo 2"]
        }
      ]);
    }, 500);
  }, []);

  const handleSelectStation = (id: number) => {
    setSelectedStation(id);
  };

  const handleViewMap = () => {
    navigate("/");
  };

  const handleRouteClick = (id: number) => {
    // Para simular a navegação para o mapa com a rota já traçada
    navigate("/");
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
            onClick={handleViewMap}
            className="text-xs"
          >
            Ver no mapa
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {stations.length > 0 ? (
          <StationList 
            stations={stations} 
            selectedStation={selectedStation} 
            onSelectStation={handleSelectStation}
            onRouteClick={handleRouteClick}
          />
        ) : (
          <div className="flex items-center justify-center py-6">
            <div className="animate-pulse text-muted-foreground">
              Buscando estações próximas...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
