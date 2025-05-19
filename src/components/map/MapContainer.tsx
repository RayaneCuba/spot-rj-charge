
import { MapContainer as LeafletMap, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StationMarker } from './StationMarker';
import { useEffect } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useMapInteraction } from '@/hooks/useMapInteraction';
import { UserLocationMarker } from './UserLocationMarker';

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

// Component to update map reference once it's ready
function MapReady({ setMap }: { setMap: (map: L.Map) => void }) {
  const map = useMap();
  
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  
  return null;
}

export function MapContainer({ stations, selectedStation, onSelectStation }: MapContainerProps) {
  const { userLocation } = useUserLocation();
  const { map, setMap } = useMapInteraction({
    selectedStationId: selectedStation,
    stations,
    userLocation
  });

  return (
    <LeafletMap
      center={[40.7128, -74.0060]} // Default to New York
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      {/* Component to set map reference */}
      <MapReady setMap={setMap} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User location marker */}
      {userLocation && (
        <UserLocationMarker position={userLocation} />
      )}
      
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
