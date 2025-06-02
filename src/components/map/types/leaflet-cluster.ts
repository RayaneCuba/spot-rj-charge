
// Type declarations for Leaflet MarkerCluster
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
