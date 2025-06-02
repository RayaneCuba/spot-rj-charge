
import { memo } from "react";
import { useChargingMapState } from "@/hooks/useChargingMapState";
import { useChargingMapInitialization } from "@/hooks/useChargingMapInitialization";
import { useChargingMapRouting } from "@/hooks/useChargingMapRouting";
import { useChargingMapFilters } from "@/hooks/useChargingMapFilters";
import { useChargingMapData } from "./hooks/useChargingMapData";
import { useChargingMapEffects } from "./hooks/useChargingMapEffects";
import { ChargingMapContent } from "./ChargingMapContent";

interface ChargingMapContainerProps {
  cityFilter: string;
}

export const ChargingMapContainer = memo(function ChargingMapContainer({ 
  cityFilter 
}: ChargingMapContainerProps) {
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

  // Initialize the map
  useChargingMapInitialization({
    setLoadingState,
    setErrorState
  });
  
  // Get all data needed for the map
  const {
    userLocation,
    allStations,
    displayStations,
    showNearbyStations,
    handleShowNearbyStations,
    filters,
    updateFilters
  } = useChargingMapData({ cityFilter });

  // Handle routing functionality
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

  // Handle filters
  const {
    uniqueConnectorTypes,
    handleFilterChange
  } = useChargingMapFilters({
    allStations,
    updateFilters,
    filters
  });

  // Handle side effects
  useChargingMapEffects({
    clearRoute,
    selectedStation
  });

  return (
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
  );
});
