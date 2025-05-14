
import { useState } from "react";
import { chargingStations } from "@/data/stations";
import { MapboxConfig } from "./MapboxConfig";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(
    localStorage.getItem("mapbox_token")
  );

  const filteredStations = cityFilter && cityFilter !== "all"
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;

  const handleSetMapboxToken = (token: string) => {
    setMapboxToken(token);
  };

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
  };

  return (
    <div className="space-y-6">
      {!mapboxToken ? (
        <MapboxConfig onSaveToken={handleSetMapboxToken} />
      ) : (
        <>
          <MapContainer 
            stations={filteredStations} 
            mapboxToken={mapboxToken} 
            selectedStation={selectedStation} 
          />
          
          <StationList 
            stations={filteredStations} 
            selectedStation={selectedStation} 
            onSelectStation={handleStationSelect} 
          />
        </>
      )}
    </div>
  );
}
