
import { useState } from 'react';
import { Station } from '@/types/Station';
import { useStationEnhancement } from './stations/useStationEnhancement';
import { useStationDistance } from './stations/useStationDistance';
import { useStationFilters } from './stations/useStationFilters';

interface UseStationsProps {
  stations: Station[];
  userLocation: [number, number] | null;
  cityFilter: string;
}

export function useStations({ stations, userLocation, cityFilter }: UseStationsProps) {
  const [showNearbyStations, setShowNearbyStations] = useState<boolean>(false);
  
  // Enhance stations with availability and connector types
  const { enhancedStations } = useStationEnhancement({ stations, cityFilter });
  
  // Add distance calculations and sorting
  const { stationsWithDistance } = useStationDistance({ 
    stations: enhancedStations, 
    userLocation 
  });
  
  // Handle filtering
  const { filters, filteredStations, updateFilters } = useStationFilters({
    stations: stationsWithDistance
  });

  const handleShowNearbyStations = () => {
    setShowNearbyStations(true);
  };

  // Determine which stations to display
  const displayStations = showNearbyStations && filteredStations.length > 0
    ? filteredStations.slice(0, 5) // Show only the 5 nearest
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
