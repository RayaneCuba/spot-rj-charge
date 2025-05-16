
import { useEffect, useRef, useState } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { StationMarker } from "./StationMarker";
import "leaflet/dist/leaflet.css";

// This fix is needed for the default marker icons
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map operations that need the map instance
function MapController({ stations, selectedStation }: { 
  stations: Array<{
    id: number;
    lat: number;
    lng: number;
  }>;
  selectedStation: number | null;
}) {
  const map = useMap();
  
  // Fit map to show all markers
  useEffect(() => {
    if (stations.length > 0) {
      try {
        // Initialize with a proper LatLngTuple
        const bounds = new L.LatLngBounds([[0, 0]]);
        stations.forEach(station => {
          bounds.extend([station.lat, station.lng]);
        });
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (error) {
        console.error("Error fitting bounds to map:", error);
        // If bounds setting fails, use fallback to center on first station
        if (stations.length > 0) {
          map.setView([stations[0].lat, stations[0].lng], 11);
        }
      }
    }
  }, [stations, map]);
  
  // Center map on selected station
  useEffect(() => {
    if (selectedStation) {
      const station = stations.find(s => s.id === selectedStation);
      if (station) {
        try {
          map.flyTo([station.lat, station.lng], 15, {
            animate: true,
            duration: 1
          });
        } catch (error) {
          console.error("Error flying to station:", error);
          // Fallback to regular setView
          map.setView([station.lat, station.lng], 15);
        }
      }
    }
  }, [selectedStation, stations, map]);
  
  return null;
}

interface MapContainerProps {
  stations: Array<{
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
    lat: number;
    lng: number;
  }>;
  selectedStation: number | null;
  onSelectStation: (id: number) => void;
}

export function MapContainer({ stations, selectedStation, onSelectStation }: MapContainerProps) {
  // Center of Rio de Janeiro as initial position
  const defaultCenter: [number, number] = [-22.9035, -43.2096];
  const [mapError, setMapError] = useState<boolean>(false);
  
  return (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border">
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center p-4 text-center">
          <div>
            <p className="text-red-500 font-semibold mb-2">Erro ao carregar o mapa</p>
            <p className="text-sm text-muted-foreground">Verifique sua conexão com internet e tente novamente</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      ) : (
        <LeafletMapContainer 
          center={defaultCenter} 
          zoom={9} 
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
          whenReady={() => console.log("Map is ready")}
          whenCreated={(map) => {
            // Log map creation success
            console.log("Map successfully created");
          }}
          onError={(e) => {
            console.error("Map error:", e);
            setMapError(true);
            toast.error("Erro ao carregar o mapa");
          }}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stations.map(station => (
            <StationMarker 
              key={station.id}
              station={station}
              isSelected={station.id === selectedStation}
              onClick={() => onSelectStation(station.id)}
            />
          ))}
          <MapController stations={stations} selectedStation={selectedStation} />
        </LeafletMapContainer>
      )}
    </div>
  );
}
