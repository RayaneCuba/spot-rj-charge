
import { useEffect } from "react";

interface UseChargingMapEffectsProps {
  clearRoute: () => void;
  selectedStation: number | null;
}

export function useChargingMapEffects({ clearRoute, selectedStation }: UseChargingMapEffectsProps) {
  // Clear route when changing selected station
  useEffect(() => {
    clearRoute();
  }, [selectedStation, clearRoute]);
}
