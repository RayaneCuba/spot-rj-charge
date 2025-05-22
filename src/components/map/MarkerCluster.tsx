
import { useEffect, useState, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import { StationMarker } from './StationMarker';
import { Station } from '@/types/Station';
import { trackPerformance } from '@/lib/performance-monitoring';

// Add this declaration to properly augment the Leaflet type
declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    chunkedLoading?: boolean;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    maxClusterRadius?: number | ((zoom: number) => number);
    disableClusteringAtZoom?: number;
    animate?: boolean;
    chunkDelay?: number;
    chunkProgress?: (processed: number, total: number, elapsed: number) => void;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
  
  interface MarkerClusterGroup extends L.FeatureGroup {
    clearLayers(): this;
    addLayer(layer: L.Layer): this;
    addLayers(layers: L.Layer[]): this;
    getLayers(): L.Layer[];
    zoomToShowLayer(layer: L.Layer, callback?: () => void): void;
  }
}

interface MarkerClusterProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (stationId: number) => void;
  minZoom?: number;
}

export function MarkerCluster({ 
  stations, 
  selectedStation, 
  onSelectStation,
  minZoom = 5 
}: MarkerClusterProps) {
  const map = useMap();
  const [clusterGroup, setClusterGroup] = useState<L.MarkerClusterGroup | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(map.getZoom());
  const [visibleMarkers, setVisibleMarkers] = useState<Station[]>([]);
  const markersRef = useRef<{[id: number]: L.Marker}>({});
  
  // Inicializar o grupo de cluster uma vez
  useEffect(() => {
    if (!map) return;
    
    const startTime = performance.now();
    
    // Criação do grupo de cluster com opções de performance
    const cluster = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: (zoom) => {
        // Ajustar o raio de clustering baseado no nível de zoom
        return zoom > 12 ? 40 : zoom > 10 ? 60 : 80;
      },
      disableClusteringAtZoom: 13, // Não agrupar em níveis de zoom próximos
      animate: true,
      chunkDelay: 50, // Add delay between processing clusters for smoother rendering
      chunkProgress: (processed, total) => {
        if (processed === total) {
          const endTime = performance.now();
          trackPerformance('clusterInitialization', endTime - startTime);
        }
      }
    });
    
    map.addLayer(cluster);
    setClusterGroup(cluster);
    
    // Listener para acompanhar mudanças de zoom
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };
    
    map.on('zoomend', handleZoomChange);
    
    return () => {
      if (map) {
        map.removeLayer(cluster);
        map.off('zoomend', handleZoomChange);
      }
    };
  }, [map]);
  
  // Memoize filtering logic to prevent unnecessary recalculations
  const filteredStations = useMemo(() => {
    // Filtragem de estações baseada no zoom
    return stations.filter(station => {
      if (currentZoom < minZoom) {
        // Em níveis baixos de zoom, mostrar apenas estações principais
        return station.id % 3 === 0; // Exemplo simples: mostrar 1/3 das estações
      }
      return true;
    });
  }, [stations, currentZoom, minZoom]);

  // Update visible markers when filtered stations change
  useEffect(() => {
    setVisibleMarkers(filteredStations);
  }, [filteredStations]);

  // Create all marker instances in one batch
  const markers = useMemo(() => {
    return visibleMarkers.map(station => {
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
  }, [visibleMarkers, selectedStation, onSelectStation]);

  // Renderizar marcadores no grupo de cluster
  useEffect(() => {
    if (!clusterGroup || !map) return;
    
    const startTime = performance.now();
    
    // Limpar marcadores existentes
    clusterGroup.clearLayers();
    
    // Add markers in batch for better performance
    clusterGroup.addLayers(markers);
    
    // Centralizar no marcador selecionado se necessário
    if (selectedStation !== null) {
      const selectedMarker = markersRef.current[selectedStation];
      if (selectedMarker) {
        clusterGroup.zoomToShowLayer(selectedMarker);
      }
    }
    
    trackPerformance('markerRendering', performance.now() - startTime, { markerCount: markers.length });
    
    return () => {
      clusterGroup.clearLayers();
    };
  }, [clusterGroup, markers, selectedStation, map]);

  return null; // O componente não renderiza elementos React diretamente
}
