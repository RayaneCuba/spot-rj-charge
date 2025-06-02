
import { useState, useMemo, useCallback } from 'react';
import { Station } from '@/types/Station';

interface StationFilters {
  types: string[];
  availability: "all" | "available" | "busy";
  maxDistance?: number;
}

interface UseStationFiltersProps {
  stations: Station[];
}

export function useStationFilters({ stations }: UseStationFiltersProps) {
  const [filters, setFilters] = useState<StationFilters>({
    types: [],
    availability: "all",
    maxDistance: undefined
  });

  const filteredStations = useMemo(() => {
    let result = [...stations];
    
    // Filter by connector type
    if (filters.types.length > 0) {
      result = result.filter(station => 
        station.connectorTypes?.some(type => filters.types.includes(type)) || false
      );
    }
    
    // Filter by availability
    if (filters.availability !== "all") {
      result = result.filter(station => 
        filters.availability === "available" 
          ? station.availability === "disponível"
          : station.availability === "ocupado"
      );
    }
    
    // Filter by distance
    if (filters.maxDistance !== undefined) {
      result = result.filter(station => 
        (station.distance || Infinity) <= filters.maxDistance!
      );
    }
    
    return result;
  }, [stations, filters]);

  const updateFilters = useCallback((newFilters: Partial<StationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    filters,
    filteredStations,
    updateFilters
  };
}
