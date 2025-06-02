
import { memo, useMemo } from "react";
import { Station } from "@/types/Station";
import { StationCard } from "./StationCard";
import { VirtualStationList } from "./VirtualStationList";
import { StationListSkeleton } from "@/components/ui/StationListSkeleton";

interface StationListProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (id: number) => void;
  onRouteClick?: (id: number) => void;
  isLoading?: boolean;
  useVirtualScroll?: boolean;
  containerHeight?: number;
}

export const StationList = memo(function StationList({ 
  stations, 
  selectedStation, 
  onSelectStation, 
  onRouteClick,
  isLoading = false,
  useVirtualScroll = false,
  containerHeight = 600
}: StationListProps) {
  
  // Use virtual scroll for large lists
  const shouldUseVirtualScroll = useMemo(() => 
    useVirtualScroll || stations.length > 20,
    [useVirtualScroll, stations.length]
  );

  if (isLoading) {
    return <StationListSkeleton count={6} />;
  }

  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Nenhuma estação encontrada com os filtros aplicados</p>
      </div>
    );
  }

  if (shouldUseVirtualScroll) {
    return (
      <VirtualStationList
        stations={stations}
        selectedStation={selectedStation}
        onSelectStation={onSelectStation}
        onRouteClick={onRouteClick}
        containerHeight={containerHeight}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((station) => (
        <StationCard 
          key={station.id}
          station={station}
          isSelected={selectedStation === station.id}
          onClick={onSelectStation}
          onRouteClick={onRouteClick}
        />
      ))}
    </div>
  );
});
