
import { useState, useEffect } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";
import { toast } from "sonner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";
import { NearbyStationsAlert } from "./stations/NearbyStationsAlert";
import { LoadingState } from "./stations/LoadingState";
import { ErrorState } from "./stations/ErrorState";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const { userLocation } = useUserLocation();
  const { displayStations, showNearbyStations, handleShowNearbyStations } = useStations({
    stations: chargingStations,
    userLocation,
    cityFilter
  });

  // Função para selecionar uma estação
  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    const station = chargingStations.find(s => s.id === stationId);
    if (station) {
      toast.success(`Estação selecionada: ${station.name}`);
    }
  };
  
  // Simular carregamento inicial para garantir que tudo está pronto
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Função para recarregar a página em caso de erro
  const handleRetry = () => window.location.reload();

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-6">
      <NearbyStationsAlert
        userLocation={userLocation}
        showNearbyStations={showNearbyStations}
        onShowNearbyStations={handleShowNearbyStations}
      />
      
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
