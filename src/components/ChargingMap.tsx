
import { useState, useEffect } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";
import { toast } from "sonner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";
import { useRouting } from "@/hooks/useRouting";
import { NearbyStationsAlert } from "./stations/NearbyStationsAlert";
import { LoadingState } from "./stations/LoadingState";
import { ErrorState } from "./stations/ErrorState";
import { FilterPanel } from "./filters/FilterPanel";
import { Station } from "@/types/Station";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const { userLocation } = useUserLocation();
  const { 
    allStations, 
    displayStations, 
    showNearbyStations, 
    handleShowNearbyStations,
    filters,
    updateFilters
  } = useStations({
    stations: chargingStations,
    userLocation,
    cityFilter
  });

  const { 
    routeInfo, 
    isRoutingLoading, 
    calculateRoute, 
    clearRoute 
  } = useRouting({ userLocation });

  // Lista de tipos únicos de conectores das estações
  const uniqueConnectorTypes = Array.from(
    new Set(
      allStations
        .flatMap(station => station.connectorTypes || [])
        .filter(Boolean)
    )
  );

  // Função para selecionar uma estação
  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    const station = displayStations.find(s => s.id === stationId);
    if (station) {
      toast.success(`Estação selecionada: ${station.name}`);
      clearRoute(); // Limpar rota ao selecionar nova estação
    }
  };

  // Função para calcular rota para a estação
  const handleRouteCalculation = async (stationId: number) => {
    const station = displayStations.find(s => s.id === stationId);
    if (!station) return;
    
    if (!userLocation) {
      toast.error("Ative sua localização para calcular a rota");
      return;
    }
    
    // Selecionar a estação ao traçar rota
    if (selectedStation !== stationId) {
      setSelectedStation(stationId);
    }
    
    // Calcular a rota
    await calculateRoute(station.lat, station.lng);
  };
  
  // Aplicar filtros
  const handleFilterChange = (newFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => {
    updateFilters(newFilters);
    toast.success("Filtros aplicados");
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
      
      <FilterPanel 
        onFilterChange={handleFilterChange}
        connectorTypes={uniqueConnectorTypes}
        initialFilters={filters}
      />
      
      {isRoutingLoading && (
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md mb-4">
          <p className="text-sm text-center">Calculando rota...</p>
        </div>
      )}
      
      <MapContainer 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
        routeInfo={routeInfo}
      />
      
      <StationList 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
        onRouteClick={handleRouteCalculation}
      />
    </div>
  );
}
