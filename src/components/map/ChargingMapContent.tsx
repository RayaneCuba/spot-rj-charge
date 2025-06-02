
import { memo } from "react";
import { ChargingMapControls } from "./ChargingMapControls";
import { ChargingMapMain } from "./ChargingMapMain";
import { ErrorState } from "../stations/ErrorState";
import { LoadingState } from "../stations/LoadingState";
import { RouteInfo, Station } from "@/types/Station";

interface ChargingMapContentProps {
  isLoading: boolean;
  hasError: boolean;
  handleRetry: () => void;
  userLocation: [number, number] | null;
  showNearbyStations: boolean;
  handleShowNearbyStations: () => void;
  filters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  };
  uniqueConnectorTypes: string[];
  handleFilterChange: (newFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => void;
  isRoutingLoading: boolean;
  displayStations: Station[];
  selectedStation: number | null;
  handleStationSelect: (stationId: number) => void;
  routeInfo: RouteInfo | null;
  handleRouteCalculation: (stationId: number) => Promise<void>;
}

export const ChargingMapContent = memo(function ChargingMapContent({
  isLoading,
  hasError,
  handleRetry,
  userLocation,
  showNearbyStations,
  handleShowNearbyStations,
  filters,
  uniqueConnectorTypes,
  handleFilterChange,
  isRoutingLoading,
  displayStations,
  selectedStation,
  handleStationSelect,
  routeInfo,
  handleRouteCalculation
}: ChargingMapContentProps) {
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <>
      <ChargingMapControls
        userLocation={userLocation}
        showNearbyStations={showNearbyStations}
        handleShowNearbyStations={handleShowNearbyStations}
        filters={filters}
        uniqueConnectorTypes={uniqueConnectorTypes}
        handleFilterChange={handleFilterChange}
      />
      
      <ChargingMapMain
        isRoutingLoading={isRoutingLoading}
        displayStations={displayStations}
        selectedStation={selectedStation}
        handleStationSelect={handleStationSelect}
        routeInfo={routeInfo}
        handleRouteCalculation={handleRouteCalculation}
      />
    </>
  );
});
