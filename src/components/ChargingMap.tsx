
import { useEffect, memo } from "react";
import { chargingStations } from "@/data/stations";
import { toast } from "sonner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";
import { useChargingMapState } from "@/hooks/useChargingMapState";
import { useChargingMapInitialization } from "@/hooks/useChargingMapInitialization";
import { useChargingMapRouting } from "@/hooks/useChargingMapRouting";
import { useChargingMapFilters } from "@/hooks/useChargingMapFilters";
import { ChargingMapContent } from "./map/ChargingMapContent";
import { AsyncBoundary } from "./ui/AsyncBoundary";

interface ChargingMapProps {
  cityFilter?: string;
}

export const ChargingMap = memo(function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const {
    selectedStation,
    isLoading,
    hasError,
    handleStationSelect,
    handleRetry,
    setLoadingState,
    setErrorState,
    setSelectedStation
  } = useChargingMapState();

  const { userLocation } = useUserLocation();
  
  // Inicializar o mapa
  useChargingMapInitialization({
    setLoadingState,
    setErrorState
  });
  
  // Usar hooks para estações
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

  // Usar hook para roteamento
  const {
    routeInfo,
    isRoutingLoading,
    handleRouteCalculation,
    clearRoute
  } = useChargingMapRouting({
    userLocation,
    displayStations,
    selectedStation,
    setSelectedStation
  });

  // Usar hook para filtros
  const {
    uniqueConnectorTypes,
    handleFilterChange
  } = useChargingMapFilters({
    allStations,
    updateFilters,
    filters
  });

  // Limpar rota quando mudar a estação selecionada
  useEffect(() => {
    clearRoute();
  }, [selectedStation, clearRoute]);

  return (
    <div className="space-y-6">
      <AsyncBoundary>
        <ChargingMapContent
          isLoading={isLoading}
          hasError={hasError}
          handleRetry={handleRetry}
          userLocation={userLocation}
          showNearbyStations={showNearbyStations}
          handleShowNearbyStations={handleShowNearbyStations}
          filters={filters}
          uniqueConnectorTypes={uniqueConnectorTypes}
          handleFilterChange={handleFilterChange}
          isRoutingLoading={isRoutingLoading}
          displayStations={displayStations}
          selectedStation={selectedStation}
          handleStationSelect={handleStationSelect}
          routeInfo={routeInfo}
          handleRouteCalculation={handleRouteCalculation}
        />
      </AsyncBoundary>
    </div>
  );
});
