
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { memo, useEffect, useMemo } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useMapInteraction } from '@/hooks/useMapInteraction';
import { UserLocationMarker } from './UserLocationMarker';
import { LazyRouteDisplay } from './LazyRouteDisplay';
import { MarkerCluster } from './MarkerCluster';
import { Station, RouteInfo } from '@/types/Station';

interface MapContainerProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
  routeInfo: RouteInfo | null;
}

// Componente para atualizar a referência do mapa uma vez que estiver pronto
function MapReady({ setMap }: { setMap: (map: L.Map) => void }) {
  const map = useMap();
  
  useEffect(() => {
    setMap(map);
    
    // Configurações adicionais de performance
    map.options.maxZoom = 18; // Limitar zoom máximo
  }, [map, setMap]);
  
  return null;
}

// Componente de mapa memoizado
export const MapContainer = memo(function MapContainer({ 
  stations, 
  selectedStation, 
  onSelectStation, 
  routeInfo 
}: MapContainerProps) {
  const { userLocation } = useUserLocation();
  const { map, setMap } = useMapInteraction({
    selectedStationId: selectedStation,
    stations,
    userLocation
  });

  // Memoize center position - ensuring it's a proper LatLngExpression
  const defaultCenter: LatLngExpression = useMemo(() => 
    userLocation ? (userLocation as LatLngExpression) : [-22.9068, -43.1729] as LatLngExpression, 
    [userLocation]
  );

  return (
    <LeafletMap
      center={defaultCenter}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
      preferCanvas={true} // Usar Canvas Renderer para melhor performance
      renderer={L.canvas({ tolerance: 5 })} // Configuração adicional de performance
    >
      {/* Componente para definir a referência do mapa */}
      <MapReady setMap={setMap} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        tileSize={256}
        maxZoom={18}
      />
      
      {/* Marcador de localização do usuário */}
      {userLocation && (
        <UserLocationMarker position={userLocation} />
      )}
      
      {/* Exibição da rota */}
      <LazyRouteDisplay routeInfo={routeInfo} />
      
      {/* Clustering de marcadores de estações */}
      <MarkerCluster 
        stations={stations} 
        selectedStation={selectedStation} 
        onSelectStation={onSelectStation}
      />
    </LeafletMap>
  );
});
