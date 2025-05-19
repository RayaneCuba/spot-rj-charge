
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

interface StationMarkerProps {
  station: {
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    lat: number;
    lng: number;
    distance?: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function StationMarker({ station, isSelected, onClick }: StationMarkerProps) {
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
  
  // Use effect to create the icon to avoid SSR issues
  useEffect(() => {
    // Criar ícone personalizado para o marcador
    const iconUrl = isSelected 
      ? "/marker-electric-green.svg" 
      : "/marker-blue.svg";
      
    const icon = new L.Icon({
      iconUrl: iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'leaflet/dist/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
    
    setMarkerIcon(icon);
  }, [isSelected]);
  
  // Renderizar apenas quando o ícone estiver carregado
  if (!markerIcon) return null;

  return (
    <Marker 
      position={[station.lat, station.lng]} 
      icon={markerIcon}
      eventHandlers={{
        click: onClick
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-sm">{station.name}</h3>
          <p className="text-xs">{station.city}</p>
          <p className="text-xs">Tipo: {station.type}</p>
          <p className="text-xs">Horário: {station.hours}</p>
          {station.distance !== undefined && (
            <p className="text-xs">Distância: {station.distance.toFixed(1)} km</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
