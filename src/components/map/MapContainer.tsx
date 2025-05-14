
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapMarker } from "./MapMarker";

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
  mapboxToken: string;
  selectedStation: number | null;
  onMarkerCreated?: (marker: mapboxgl.Marker) => void;
}

export function MapContainer({ stations, mapboxToken, selectedStation }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

  // Update markers when stations or selected station change
  useEffect(() => {
    if (mapInstance.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add new markers
      addMarkers();
      
      // Fit bounds to show all markers
      if (stations.length > 0) {
        fitMapBounds();
      }
    }
  }, [stations, selectedStation]);

  // Add markers to the map
  const addMarkers = () => {
    if (!mapInstance.current) return;
    
    stations.forEach(station => {
      const marker = MapMarker({
        station,
        isSelected: station.id === selectedStation,
        mapInstance: mapInstance.current!
      });
      
      // Store marker reference for cleanup
      markersRef.current.push(marker);
    });
  };

  // Fit map to show all markers
  const fitMapBounds = () => {
    if (!mapInstance.current || stations.length === 0) return;
    
    const bounds = new mapboxgl.LngLatBounds();
    
    stations.forEach(station => {
      bounds.extend([station.lng, station.lat]);
    });
    
    mapInstance.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  };
  
  // Find station and center map on it when selected
  useEffect(() => {
    if (selectedStation && mapInstance.current) {
      const station = stations.find(s => s.id === selectedStation);
      if (station) {
        mapInstance.current.flyTo({
          center: [station.lng, station.lat],
          zoom: 15,
          essential: true
        });
        
        // Show popup for the selected station
        markersRef.current.forEach(marker => {
          const stationLngLat = marker.getLngLat();
          if (stationLngLat.lng === station.lng && stationLngLat.lat === station.lat) {
            marker.togglePopup();
          }
        });
      }
    }
  }, [selectedStation, stations]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
    />
  );
}
