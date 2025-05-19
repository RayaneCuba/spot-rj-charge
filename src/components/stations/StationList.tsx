
import { StationCard } from "./StationCard";
import { Station } from "@/types/Station";

interface StationListProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (id: number) => void;
  onRouteClick?: (id: number) => void;
}

export function StationList({ stations, selectedStation, onSelectStation, onRouteClick }: StationListProps) {
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
}
