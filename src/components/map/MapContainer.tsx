
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StationMarker } from './StationMarker';
import { useEffect } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useMapInteraction } from '@/hooks/useMapInteraction';
import { UserLocationMarker } from './UserLocationMarker';
import { Station } from '@/types/Station';

interface MapContainerProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
}

// Componente para atualizar a referência do mapa uma vez que estiver pronto
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
      center={[-22.9068, -43.1729]} // Padrão: Rio de Janeiro
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      {/* Componente para definir a referência do mapa */}
      <MapReady setMap={setMap} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Marcador de localização do usuário */}
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
