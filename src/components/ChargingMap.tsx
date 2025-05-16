import { useState, useEffect } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";
import { Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ChargingMapProps {
  cityFilter?: string;
}

interface Station {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: string;
  hours: string;
  distance?: number; // Distância adicionada opcionalmente
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [stationsWithDistance, setStationsWithDistance] = useState<Station[]>([]);
  const [showNearbyStations, setShowNearbyStations] = useState<boolean>(false);

  // Filtrar estações por cidade
  const filteredStations = cityFilter && cityFilter !== "all"
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

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

  // Calcular distâncias e ordenar estações quando a localização do usuário muda
  useEffect(() => {
    if (userLocation) {
      const [userLat, userLng] = userLocation;
      
      const stationsWithDist = filteredStations.map(station => {
        const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
        return { ...station, distance };
      });
      
      // Ordenar por distância
      stationsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setStationsWithDistance(stationsWithDist);
    } else {
      setStationsWithDistance(filteredStations);
    }
  }, [userLocation, filteredStations]);

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    const station = chargingStations.find(s => s.id === stationId);
    if (station) {
      toast.success(`Estação selecionada: ${station.name}`);
    }
  };

  const handleShowNearbyStations = () => {
    setShowNearbyStations(true);
    if (stationsWithDistance.length > 0 && stationsWithDistance[0].distance !== undefined) {
      toast.success(`Mostrando ${Math.min(5, stationsWithDistance.length)} estações mais próximas`);
    }
  };
  
  // Simular carregamento inicial para garantir que tudo está pronto
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-center p-6">
          <p className="text-red-500 font-semibold text-lg mb-2">Erro ao carregar o mapa</p>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível carregar os dados das estações de carregamento.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Determinar quais estações exibir
  const displayStations = showNearbyStations && stationsWithDistance.length > 0
    ? stationsWithDistance.slice(0, 5) // Mostrar apenas as 5 mais próximas
    : stationsWithDistance;

  return (
    <div className="space-y-6">
      {userLocation && (
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg mb-4">
          <div>
            <h3 className="font-semibold text-sm mb-1">Localização detectada</h3>
            <p className="text-xs text-muted-foreground">
              Exibindo estações de carregamento na região
            </p>
          </div>
          <Button 
            onClick={handleShowNearbyStations} 
            variant="default" 
            className="gap-2"
            disabled={showNearbyStations}
          >
            <Navigation className="h-4 w-4" />
            {showNearbyStations ? 'Mostrando próximas' : 'Ver mais próximas'}
          </Button>
        </div>
      )}
      
      <MapContainer 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
      />
      
      <StationList 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect} 
      />
    </div>
  );
}
