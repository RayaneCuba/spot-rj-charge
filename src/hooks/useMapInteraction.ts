
import { useState, useEffect } from 'react';
import L from 'leaflet';

interface UseMapInteractionProps {
  selectedStationId: number | null;
  stations: Array<{
    id: number;
    lat: number;
    lng: number;
  }>;
  userLocation: [number, number] | null;
}

export function useMapInteraction({ 
  selectedStationId, 
  stations, 
  userLocation 
}: UseMapInteractionProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  // Fly to selected station when it changes
  useEffect(() => {
    if (selectedStationId && map) {
      const station = stations.find(station => station.id === selectedStationId);
      if (station) {
        map.flyTo([station.lat, station.lng], 15, {
          duration: 2
        });
      }
    }
  }, [selectedStationId, stations, map]);

  // Center map on user location when it's available
  useEffect(() => {
    if (map && userLocation) {
      map.flyTo(userLocation, 14);
    }
  }, [map, userLocation]);

  return { map, setMap };
}
