
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface StationMarkerProps {
  station: {
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    lat: number;
    lng: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function StationMarker({ station, isSelected, onClick }: StationMarkerProps) {
  // Create a custom marker icon
  const iconUrl = isSelected 
    ? "/marker-electric-green.png" 
    : "/marker-blue.png";
    
  const markerIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

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
        </div>
      </Popup>
    </Marker>
  );
}
