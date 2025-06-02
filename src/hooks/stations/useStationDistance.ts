
import { useMemo } from 'react';
import { Station } from '@/types/Station';

interface UseStationDistanceProps {
  stations: Station[];
  userLocation: [number, number] | null;
}

// Calculate distance between coordinates (using Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export function useStationDistance({ stations, userLocation }: UseStationDistanceProps) {
  const stationsWithDistance = useMemo(() => {
    if (!userLocation) return stations;
    
    const [userLat, userLng] = userLocation;
    
    const stationsWithDist = stations.map(station => {
      const distance = calculateDistance(userLat, userLng, station.lat, station.lng);
      return { ...station, distance };
    });
    
    // Sort by distance
    return stationsWithDist.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [stations, userLocation]);

  return { stationsWithDistance };
}
