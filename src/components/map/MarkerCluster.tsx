
import { useEffect } from 'react';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import { Station } from '@/types/Station';
import { trackPerformance } from '@/lib/performance-monitoring';
import { useClusterGroup } from './hooks/useClusterGroup';
import { useStationFiltering } from './hooks/useStationFiltering';
import { useMarkerManagement } from './hooks/useMarkerManagement';
import './types/leaflet-cluster';

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
  const clusterGroup = useClusterGroup();
  
  const { filteredStations } = useStationFiltering({ 
    stations, 
    minZoom 
  });
  
  const { markers, markersRef } = useMarkerManagement({
    stations: filteredStations,
    selectedStation,
    onSelectStation
  });

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
  }, [clusterGroup, markers, selectedStation, map, markersRef]);

  return null; // O componente não renderiza elementos React diretamente
}
