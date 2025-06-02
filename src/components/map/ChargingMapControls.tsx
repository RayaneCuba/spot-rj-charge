
import { memo } from "react";
import { NearbyStationsAlert } from "../stations/NearbyStationsAlert";
import { FilterPanel } from "../filters/FilterPanel";

interface ChargingMapControlsProps {
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
}

export const ChargingMapControls = memo(function ChargingMapControls({
  userLocation,
  showNearbyStations,
  handleShowNearbyStations,
  filters,
  uniqueConnectorTypes,
  handleFilterChange
}: ChargingMapControlsProps) {
  return (
    <>
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
    </>
  );
});
