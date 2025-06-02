
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createClusterConfig } from '../config/cluster-config';
import { trackPerformance } from '@/lib/performance-monitoring';

export function useClusterGroup() {
  const map = useMap();
  const [clusterGroup, setClusterGroup] = useState<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!map) return;
    
    const startTime = performance.now();
    
    const cluster = L.markerClusterGroup(createClusterConfig((processed, total) => {
      if (processed === total) {
        const endTime = performance.now();
        trackPerformance('clusterInitialization', endTime - startTime);
      }
    }));
    
    map.addLayer(cluster);
    setClusterGroup(cluster);
    
    return () => {
      if (map) {
        map.removeLayer(cluster);
      }
    };
  }, [map]);

  return clusterGroup;
}
