
import { chargingStations } from "@/data/stations";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";

interface UseChargingMapDataProps {
  cityFilter: string;
}

export function useChargingMapData({ cityFilter }: UseChargingMapDataProps) {
  const { userLocation } = useUserLocation();
  
  // Use hooks for stations
  const { 
    allStations, 
    displayStations, 
    showNearbyStations, 
    handleShowNearbyStations,
    filters,
    updateFilters
  } = useStations({
    stations: chargingStations,
    userLocation,
    cityFilter
  });

  return {
    userLocation,
    allStations,
    displayStations,
    showNearbyStations,
    handleShowNearbyStations,
    filters,
    updateFilters
  };
}
