
import { useMemo } from "react";
import { chargingStations } from "@/data/stations";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";
import { useStationCache } from "@/hooks/useStationCache";

interface UseChargingMapDataProps {
  cityFilter: string;
}

export function useChargingMapData({ cityFilter }: UseChargingMapDataProps) {
  const { userLocation } = useUserLocation();
  const { cache, updateCache } = useStationCache();
  
  // Check if we can use cached data
  const shouldUseCache = useMemo(() => {
    if (!cache) return false;
    
    // Verify cache is still valid for current context
    const locationMatch = JSON.stringify(cache.userLocation) === JSON.stringify(userLocation);
    return locationMatch;
  }, [cache, userLocation]);

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

  // Update cache when data changes
  useMemo(() => {
    if (allStations.length > 0 && userLocation) {
      updateCache({
        stations: allStations,
        filters,
        userLocation
      });
    }
  }, [allStations, filters, userLocation, updateCache]);

  return {
    userLocation,
    allStations: shouldUseCache ? cache.stations : allStations,
    displayStations,
    showNearbyStations,
    handleShowNearbyStations,
    filters: shouldUseCache ? cache.filters : filters,
    updateFilters
  };
}
