
import { MapContainer as LeafletMap, TileLayer, useMap, Marker, Popup, MapContainerProps as LeafletMapProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StationMarker } from './StationMarker';
import { useEffect, useState } from 'react';
import L from 'leaflet';
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
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  // Get user location
  useEffect(() => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.flyTo([latitude, longitude], 14);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map]);

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
