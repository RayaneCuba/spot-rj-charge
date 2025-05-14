
import mapboxgl from "mapbox-gl";

interface MapMarkerProps {
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
  mapInstance: mapboxgl.Map;
  onClick?: () => void;
}

export function MapMarker({ station, isSelected, mapInstance }: MapMarkerProps) {
  // Create popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <div class="p-2">
      <h3 class="font-bold text-sm">${station.name}</h3>
      <p class="text-xs">${station.city}</p>
      <p class="text-xs">Tipo: ${station.type}</p>
      <p class="text-xs">Horário: ${station.hours}</p>
    </div>
  `);
  
  // Create HTML element for the marker
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.backgroundSize = '100%';
  
  // Use different colors for selected station
  el.innerHTML = `
    <div class="flex items-center justify-center w-full h-full">
      <div class="${isSelected ? 'text-primary' : 'text-secondary'}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    </div>
  `;
  
  // Create marker with popup
  const marker = new mapboxgl.Marker({ element: el })
    .setLngLat([station.lng, station.lat])
    .setPopup(popup)
    .addTo(mapInstance);
    
  // Show popup when station is selected
  if (isSelected) {
    marker.togglePopup();
  }
  
  return marker;
}
