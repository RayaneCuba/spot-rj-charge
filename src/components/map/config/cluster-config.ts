
import L from 'leaflet';
import { trackPerformance } from '@/lib/performance-monitoring';

export function createClusterConfig(onProgress?: (processed: number, total: number) => void): L.MarkerClusterGroupOptions {
  return {
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
