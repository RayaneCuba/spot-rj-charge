
import L from 'leaflet';
import { trackPerformance } from '@/lib/performance-monitoring';
import { MAP_CONSTANTS } from '@/constants/map';

export function createClusterConfig(onProgress?: (processed: number, total: number) => void): L.MarkerClusterGroupOptions {
  return {
    chunkedLoading: true,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    maxClusterRadius: (zoom) => {
      // Use constants for cluster radius
      return zoom > 12 
        ? MAP_CONSTANTS.CLUSTER_RADIUS.HIGH_ZOOM 
        : zoom > 10 
        ? MAP_CONSTANTS.CLUSTER_RADIUS.MEDIUM_ZOOM 
        : MAP_CONSTANTS.CLUSTER_RADIUS.LOW_ZOOM;
    },
    disableClusteringAtZoom: MAP_CONSTANTS.DISABLE_CLUSTERING_ZOOM,
    animate: true,
    chunkDelay: 50,
    chunkProgress: (processed, total) => {
      if (onProgress) {
        onProgress(processed, total);
      }
      if (processed === total) {
        const endTime = performance.now();
        trackPerformance('clusterInitialization', endTime - performance.now());
      }
    }
  };
}
