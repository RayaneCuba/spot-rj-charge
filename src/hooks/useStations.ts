
import { useState, useEffect, useMemo } from 'react';
import { Station } from '@/types/Station';

interface UseStationsProps {
  stations: Station[];
  userLocation: [number, number] | null;
  cityFilter: string;
}

interface StationFilters {
  types: string[];
  availability: "all" | "available" | "busy";
  maxDistance?: number;
}

export function useStations({ stations, userLocation, cityFilter }: UseStationsProps) {
  const [stationsWithDistance, setStationsWithDistance] = useState<Station[]>([]);
  const [showNearbyStations, setShowNearbyStations] = useState<boolean>(false);
  const [filters, setFilters] = useState<StationFilters>({
    types: [],
    availability: "all",
    maxDistance: undefined
  });
  
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
    let filteredStations = cityFilter && cityFilter !== "all"
      ? stations.filter(station => station.city === cityFilter)
      : stations;
    
    // Adicionar informações de disponibilidade simulada para demo
    const stationsWithAvailability = filteredStations.map(station => {
      const random = Math.random();
      let availability: "disponível" | "ocupado" | "offline";
      
      if (random < 0.7) {
        availability = "disponível";
      } else if (random < 0.9) {
        availability = "ocupado";
      } else {
        availability = "offline";
      }
      
      // Adicionar tipos de conectores simulados
      const connectorTypes = [];
      if (station.type.includes("150kW") || station.type.includes("100kW")) {
        connectorTypes.push("CCS");
        if (Math.random() > 0.5) connectorTypes.push("CHAdeMO");
      } else if (station.type.includes("50kW")) {
        connectorTypes.push("CCS");
        connectorTypes.push("CHAdeMO");
      } else if (station.type.includes("22kW") || station.type.includes("11kW")) {
        connectorTypes.push("Tipo 2");
        if (Math.random() > 0.7) connectorTypes.push("Tipo 1");
      } else {
        connectorTypes.push("Tipo 2");
      }
      
      return { ...station, availability, connectorTypes };
    });
    
    if (userLocation) {
      const [userLat, userLng] = userLocation;
      
      const stationsWithDist = stationsWithAvailability.map(station => {
        const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
        return { ...station, distance };
      });
      
      // Ordenar por distância
      stationsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setStationsWithDistance(stationsWithDist);
    } else {
      setStationsWithDistance(stationsWithAvailability);
    }
  }, [userLocation, stations, cityFilter]);

  const handleShowNearbyStations = () => {
    setShowNearbyStations(true);
  };

  const updateFilters = (newFilters: Partial<StationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Aplicar todos os filtros
  const filteredStations = useMemo(() => {
    let result = [...stationsWithDistance];
    
    // Filtrar por tipo de carregador
    if (filters.types.length > 0) {
      result = result.filter(station => 
        station.connectorTypes?.some(type => filters.types.includes(type)) || false
      );
    }
    
    // Filtrar por disponibilidade
    if (filters.availability !== "all") {
      result = result.filter(station => 
        filters.availability === "available" 
          ? station.availability === "disponível"
          : station.availability === "ocupado"
      );
    }
    
    // Filtrar por distância máxima
    if (filters.maxDistance !== undefined) {
      result = result.filter(station => 
        (station.distance || Infinity) <= filters.maxDistance!
      );
    }
    
    return result;
  }, [stationsWithDistance, filters]);

  // Determinar quais estações exibir
  const displayStations = showNearbyStations && filteredStations.length > 0
    ? filteredStations.slice(0, 5) // Mostrar apenas as 5 mais próximas
    : filteredStations;

  return {
    allStations: stationsWithDistance,
    displayStations,
    showNearbyStations,
    handleShowNearbyStations,
    filters,
    updateFilters
  };
}
