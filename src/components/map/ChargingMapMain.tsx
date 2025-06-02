
import { memo } from "react";
import { ChargingMapView } from "./ChargingMapView";
import { StationList } from "../stations/StationList";
import { RouteInfo, Station } from "@/types/Station";

interface ChargingMapMainProps {
  isRoutingLoading: boolean;
  displayStations: Station[];
  selectedStation: number | null;
  handleStationSelect: (stationId: number) => void;
  routeInfo: RouteInfo | null;
  handleRouteCalculation: (stationId: number) => Promise<void>;
  isLoading?: boolean;
}

export const ChargingMapMain = memo(function ChargingMapMain({
  isRoutingLoading,
  displayStations,
  selectedStation,
  handleStationSelect,
  routeInfo,
  handleRouteCalculation,
  isLoading = false
}: ChargingMapMainProps) {
  return (
    <div className="space-y-6">
      <ChargingMapView 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
        routeInfo={routeInfo}
        isRoutingLoading={isRoutingLoading}
      />
      
      <div className="bg-white dark:bg-dark-blue rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">
            Estações Disponíveis ({displayStations.length})
          </h3>
        </div>
        
        <StationList 
          stations={displayStations} 
          selectedStation={selectedStation} 
          onSelectStation={handleStationSelect}
          onRouteClick={handleRouteCalculation}
          isLoading={isLoading}
          useVirtualScroll={displayStations.length > 20}
          containerHeight={400}
        />
      </div>
    </div>
  );
});
