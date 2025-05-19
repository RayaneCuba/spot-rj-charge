
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';

interface UseStationsProps {
  stations: Station[];
  userLocation: [number, number] | null;
  cityFilter: string;
}

export function useStations({ stations, userLocation, cityFilter }: UseStationsProps) {
  const [stationsWithDistance, setStationsWithDistance] = useState<Station[]>([]);
  const [showNearbyStations, setShowNearbyStations] = useState<boolean>(false);
  
  // Filtrar estações por cidade
  const filteredStations = cityFilter && cityFilter !== "all"
    ? stations.filter(station => station.city === cityFilter)
    : stations;

  // Calcular distância entre coordenadas (usando a fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  // Calcular distâncias e ordenar estações quando a localização do usuário muda
  useEffect(() => {
    if (userLocation) {
      const [userLat, userLng] = userLocation;
      
      const stationsWithDist = filteredStations.map(station => {
        const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
        return { ...station, distance };
      });
      
      // Ordenar por distância
      stationsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setStationsWithDistance(stationsWithDist);
    } else {
      setStationsWithDistance(filteredStations);
    }
  }, [userLocation, filteredStations]);

  const handleShowNearbyStations = () => {
    setShowNearbyStations(true);
  };

  // Determinar quais estações exibir
  const displayStations = showNearbyStations && stationsWithDistance.length > 0
    ? stationsWithDistance.slice(0, 5) // Mostrar apenas as 5 mais próximas
    : stationsWithDistance;

  return {
    displayStations,
    showNearbyStations,
    handleShowNearbyStations
  };
}
