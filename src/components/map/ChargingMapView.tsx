
import { memo, Suspense, useMemo } from "react";
import { MapContainer } from "./MapContainer";
import { MapSkeleton } from "@/components/ui/StationListSkeleton";
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
  // Memoize stations to prevent unnecessary re-renders
  const memoizedStations = useMemo(() => stations, [stations.length]);
  
  return (
    <div className="space-y-4">
      {isRoutingLoading && (
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-center">Calculando rota...</p>
          </div>
        </div>
      )}
      
      <Suspense fallback={<MapSkeleton />}>
        <div className="relative">
          <MapContainer 
            stations={memoizedStations} 
            selectedStation={selectedStation} 
            onSelectStation={onSelectStation}
            routeInfo={routeInfo}
          />
          
          {/* Mobile overlay controls */}
          <div className="absolute bottom-4 left-4 right-4 md:hidden">
            <div className="bg-white/90 dark:bg-dark-blue/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <p className="text-xs text-center text-muted-foreground">
                {stations.length} estações encontradas
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
});
