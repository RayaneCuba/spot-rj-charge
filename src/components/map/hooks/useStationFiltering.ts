
import { useState, useEffect, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { Station } from '@/types/Station';

interface UseStationFilteringProps {
  stations: Station[];
  minZoom?: number;
}

export function useStationFiltering({ stations, minZoom = 5 }: UseStationFilteringProps) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState<number>(map.getZoom());

  useEffect(() => {
    if (!map) return;
    
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };
    
    map.on('zoomend', handleZoomChange);
    
    return () => {
      map.off('zoomend', handleZoomChange);
    };
  }, [map]);

  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      if (currentZoom < minZoom) {
        // Em níveis baixos de zoom, mostrar apenas estações principais
        return station.id % 3 === 0; // Exemplo simples: mostrar 1/3 das estações
      }
      return true;
    });
  }, [stations, currentZoom, minZoom]);

  return {
    currentZoom,
    filteredStations
  };
}
