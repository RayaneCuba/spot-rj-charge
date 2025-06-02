
import { useMemo, useRef } from 'react';
import L from 'leaflet';
import { Station } from '@/types/Station';

interface UseMarkerManagementProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
}

export function useMarkerManagement({ 
  stations, 
  selectedStation, 
  onSelectStation 
}: UseMarkerManagementProps) {
  const markersRef = useRef<{[id: number]: L.Marker}>({});

  const markers = useMemo(() => {
    return stations.map(station => {
      const isSelected = selectedStation === station.id;
      
      // Reuse existing marker if possible
      if (markersRef.current[station.id]) {
        const marker = markersRef.current[station.id];
        
        // Update icon if selection state changed
        const currentIcon = marker.getIcon();
        const iconUrl = isSelected ? "/marker-electric-green.svg" : "/marker-blue.svg";
        
        if ((currentIcon as L.Icon).options.iconUrl !== iconUrl) {
          marker.setIcon(new L.Icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'leaflet/dist/images/marker-shadow.png',
            shadowSize: [41, 41]
          }));
        }
        
        return marker;
      }
      
      // Create new marker if it doesn't exist
      const marker = new L.Marker([station.lat, station.lng], {
        icon: new L.Icon({
          iconUrl: isSelected ? "/marker-electric-green.svg" : "/marker-blue.svg",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'leaflet/dist/images/marker-shadow.png',
          shadowSize: [41, 41]
        }),
      }).bindPopup(() => {
        const popupContainer = document.createElement('div');
        popupContainer.className = 'p-2';
        popupContainer.innerHTML = `
          <h3 class="font-bold text-sm">${station.name}</h3>
          <p class="text-xs">${station.city}</p>
          <p class="text-xs">Tipo: ${station.type}</p>
          <p class="text-xs">Horário: ${station.hours}</p>
          ${station.distance !== undefined ? 
          `<p class="text-xs">Distância: ${station.distance.toFixed(1)} km</p>` : ''}
        `;
        return popupContainer;
      });
      
      // Adicionar evento de clique
      marker.on('click', () => {
        onSelectStation(station.id);
      });
      
      // Store marker reference
      markersRef.current[station.id] = marker;
      
      return marker;
    });
  }, [stations, selectedStation, onSelectStation]);

  return { markers, markersRef };
}
