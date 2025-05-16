
import { useEffect, useState } from 'react';
import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';

interface UserLocationMarkerProps {
  position: [number, number];
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // Criar um ícone personalizado para a localização do usuário
    const icon = new L.Icon({
      iconUrl: '/user-location.svg',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
    
    setMarkerIcon(icon);
  }, []);

  if (!markerIcon) return null;

  return (
    <>
      <Marker position={position} icon={markerIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-sm">Sua localização</h3>
            <p className="text-xs">Você está aqui</p>
          </div>
        </Popup>
      </Marker>
      <Circle center={position} radius={500} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
    </>
  );
}
