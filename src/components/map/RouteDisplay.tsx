
import { useEffect } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { RouteInfo } from '@/types/Station';

interface RouteDisplayProps {
  routeInfo: RouteInfo | null;
}

export function RouteDisplay({ routeInfo }: RouteDisplayProps) {
  // Se não houver informações de rota, não renderiza nada
  if (!routeInfo || !routeInfo.geometry) return null;

  // Converte GeoJSON para coordenadas para o Polyline
  const positions = routeInfo.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

  return (
    <Polyline 
      positions={positions} 
      color="#3b82f6" 
      weight={5} 
      opacity={0.7}
      dashArray="5, 10"
    >
      <Tooltip sticky>
        <div className="p-2">
          <h3 className="font-bold text-sm">Informações da Rota</h3>
          <p className="text-xs">Distância: {routeInfo.distance.toFixed(1)} km</p>
          <p className="text-xs">Tempo estimado: {routeInfo.duration} min</p>
        </div>
      </Tooltip>
    </Polyline>
  );
}
