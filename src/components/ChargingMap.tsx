
import { useState } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  const filteredStations = cityFilter && cityFilter !== "all"
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
  };

  return (
    <div className="space-y-6">
      <MapContainer 
        stations={filteredStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
      />
      
      <StationList 
        stations={filteredStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect} 
      />
    </div>
  );
}
