
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useMap } from 'react-leaflet';
import { StationMarker } from './StationMarker';
import { Station } from '@/types/Station';

// Add this declaration to properly augment the Leaflet type
declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    chunkedLoading?: boolean;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    maxClusterRadius?: number | ((zoom: number) => number);
    disableClusteringAtZoom?: number;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
  
  interface MarkerClusterGroup extends L.FeatureGroup {
    clearLayers(): this;
    addLayer(layer: L.Layer): this;
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
  
  // Inicializar o grupo de cluster uma vez
  useEffect(() => {
    if (!map) return;
    
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
      disableClusteringAtZoom: 13 // Não agrupar em níveis de zoom próximos
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
  
  // Atualizar marcadores visíveis baseado no zoom e estações
  useEffect(() => {
    // Filtragem de estações baseada no zoom
    const filteredStations = stations.filter(station => {
      if (currentZoom < minZoom) {
        // Em níveis baixos de zoom, mostrar apenas estações principais
        return station.id % 3 === 0; // Exemplo simples: mostrar 1/3 das estações
      }
      return true;
    });
    
    setVisibleMarkers(filteredStations);
  }, [stations, currentZoom, minZoom]);

  // Renderizar marcadores no grupo de cluster
  useEffect(() => {
    if (!clusterGroup || !map) return;
    
    // Limpar marcadores existentes
    clusterGroup.clearLayers();
    
    // Adicionar novos marcadores no cluster
    visibleMarkers.forEach(station => {
      // Criar cada marcador usando o componente StationMarker
      // Mas precisamos extrair apenas o objeto L.Marker dele
      const marker = new L.Marker([station.lat, station.lng], {
        icon: new L.Icon({
          iconUrl: selectedStation === station.id 
            ? "/marker-electric-green.svg" 
            : "/marker-blue.svg",
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
      
      clusterGroup.addLayer(marker);
    });
    
    // Centralizar no marcador selecionado se necessário
    if (selectedStation !== null) {
      const selected = visibleMarkers.find(s => s.id === selectedStation);
      if (selected) {
        const marker = [...clusterGroup.getLayers()].find(
          layer => layer instanceof L.Marker && 
          layer.getLatLng().lat === selected.lat && 
          layer.getLatLng().lng === selected.lng
        );
        if (marker) {
          clusterGroup.zoomToShowLayer(marker);
        }
      }
    }
    
    return () => {
      clusterGroup.clearLayers();
    };
  }, [clusterGroup, visibleMarkers, selectedStation, onSelectStation, map]);

  return null; // O componente não renderiza elementos React diretamente
}
