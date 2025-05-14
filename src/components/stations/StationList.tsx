
import { StationCard } from "./StationCard";

interface StationListProps {
  stations: Array<{
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    lat: number;
    lng: number;
  }>;
  selectedStation: number | null;
  onSelectStation: (id: number) => void;
}

export function StationList({ stations, selectedStation, onSelectStation }: StationListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((station) => (
        <StationCard 
          key={station.id}
          station={station}
          isSelected={selectedStation === station.id}
          onClick={onSelectStation}
        />
      ))}
    </div>
  );
}
