
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { chargingStations } from "@/data/stations";
import { MapboxConfig } from "./MapboxConfig";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(
    localStorage.getItem("mapbox_token")
  );

  const filteredStations = cityFilter && cityFilter !== "all"
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapRef.current || mapInstance.current) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-43.2096, -22.9035], // Rio de Janeiro
        zoom: 9
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      
      mapInstance.current = map;

      map.on("load", () => {
        addMarkers();
      });
      
      return () => {
        // Clean up markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Clean up map
        map.remove();
        mapInstance.current = null;
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [mapboxToken]);

  // Update markers when filtered stations change
  useEffect(() => {
    if (mapInstance.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add new markers
      addMarkers();
      
      // Fit bounds to show all markers
      if (filteredStations.length > 0) {
        fitMapBounds();
      }
    }
  }, [filteredStations]);

  // Add markers to the map
  const addMarkers = () => {
    if (!mapInstance.current) return;
    
    filteredStations.forEach(station => {
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
      const isSelected = station.id === selectedStation;
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
        .addTo(mapInstance.current);
        
      // Store marker reference for cleanup
      markersRef.current.push(marker);
      
      // Show popup when station is selected from list
      if (isSelected) {
        marker.togglePopup();
      }
    });
  };

  // Fit map to show all markers
  const fitMapBounds = () => {
    if (!mapInstance.current || filteredStations.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    filteredStations.forEach(station => {
      bounds.extend([station.lng, station.lat]);
    });
    
    mapInstance.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  };

  const handleSetMapboxToken = (token: string) => {
    setMapboxToken(token);
  };

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
    
    // Find the station and center map on it
    const station = filteredStations.find(s => s.id === stationId);
    if (station && mapInstance.current) {
      mapInstance.current.flyTo({
        center: [station.lng, station.lat],
        zoom: 15,
        essential: true
      });
      
      // Show popup for the selected station
      markersRef.current.forEach(marker => {
        const markerElement = marker.getElement();
        const stationLngLat = marker.getLngLat();
        
        if (stationLngLat.lng === station.lng && stationLngLat.lat === station.lat) {
          marker.togglePopup();
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {!mapboxToken ? (
        <MapboxConfig onSaveToken={handleSetMapboxToken} />
      ) : (
        <>
          <div 
            ref={mapRef} 
            className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((station) => (
              <Card 
                key={station.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedStation === station.id ? 'border-primary' : ''}`}
                onClick={() => handleStationSelect(station.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className={`h-5 w-5 mt-1 ${selectedStation === station.id ? 'text-primary' : 'text-secondary'}`} />
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg">{station.name}</h3>
                      <p className="text-muted-foreground text-sm">{station.city}</p>
                      <div className="mt-2 text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tipo:</span>
                          <span>{station.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horário:</span>
                          <span>{station.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
