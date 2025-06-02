
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
}

export const ChargingMapMain = memo(function ChargingMapMain({
  isRoutingLoading,
  displayStations,
  selectedStation,
  handleStationSelect,
  routeInfo,
  handleRouteCalculation
}: ChargingMapMainProps) {
  return (
    <>
      <ChargingMapView 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
        routeInfo={routeInfo}
        isRoutingLoading={isRoutingLoading}
      />
      
      <StationList 
        stations={displayStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
        onRouteClick={handleRouteCalculation}
      />
    </>
  );
});
