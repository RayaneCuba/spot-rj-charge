import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StationMarker } from './StationMarker';
import { useEffect, useState } from 'react';
import L from 'leaflet';

interface MapContainerProps {
  stations: {
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    lat: number;
    lng: number;
  }[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
}

export function MapContainer({ stations, selectedStation, onSelectStation }: MapContainerProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  // Fly to selected station
  useEffect(() => {
    if (selectedStation && map) {
      const station = stations.find(station => station.id === selectedStation);
      if (station) {
        map.flyTo([station.lat, station.lng], 15, {
          duration: 2
        });
      }
    }
  }, [selectedStation, stations, map]);

  return (
    <LeafletMap
      center={[40.7128, -74.0060]} // Default to New York
      zoom={12}
      style={{ height: "500px", width: "100%" }}
      whenReady={(e) => setMap(e.target)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map(station => (
        <StationMarker
          key={station.id}
          station={station}
          isSelected={selectedStation === station.id}
          onClick={() => onSelectStation(station.id)}
        />
      ))}
    </LeafletMap>
  );
}
