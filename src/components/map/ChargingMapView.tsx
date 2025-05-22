
import { memo, Suspense } from "react";
import { MapContainer } from "./MapContainer";
import { LoadingState } from "../stations/LoadingState";
import { RouteInfo, Station } from "@/types/Station";

interface ChargingMapViewProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
  routeInfo: RouteInfo | null;
  isRoutingLoading: boolean;
}

export const ChargingMapView = memo(function ChargingMapView({
  stations,
  selectedStation,
  onSelectStation,
  routeInfo,
  isRoutingLoading
}: ChargingMapViewProps) {
  return (
    <>
      {isRoutingLoading && (
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md mb-4">
          <p className="text-sm text-center">Calculando rota...</p>
        </div>
      )}
      
      <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Carregando mapa...</div>}>
        <MapContainer 
          stations={stations} 
          selectedStation={selectedStation} 
          onSelectStation={onSelectStation}
          routeInfo={routeInfo}
        />
      </Suspense>
    </>
  );
});
