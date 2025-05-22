
import { useCallback, useRef } from "react";
import { measurePerformanceAsync } from "@/lib/performance-monitoring";
import { toast } from "sonner";
import { Station } from "@/types/Station";
import { useRouting } from "./useRouting";

interface UseChargingMapRoutingProps {
  userLocation: [number, number] | null;
  displayStations: Station[];
  selectedStation: number | null;
  setSelectedStation: (stationId: number) => void;
}

export function useChargingMapRouting({
  userLocation,
  displayStations,
  selectedStation,
  setSelectedStation
}: UseChargingMapRoutingProps) {
  
  const { 
    routeInfo, 
    isRoutingLoading, 
    calculateRoute, 
    clearRoute 
  } = useRouting({ userLocation });
  
  // Use a ref to track active route calculations
  const activeRouteCalc = useRef<{ stationId: number | null }>({ stationId: null });

  // Função para calcular rota para a estação usando useCallback
  const handleRouteCalculation = useCallback(async (stationId: number) => {
    // Skip if already calculating for this station
    if (activeRouteCalc.current.stationId === stationId && isRoutingLoading) {
      console.debug('Route calculation already in progress for station:', stationId);
      return;
    }
    
    activeRouteCalc.current.stationId = stationId;
    
    // Usar função de medição de performance para operações assíncronas
    return measurePerformanceAsync(
      `routeCalculation.${stationId}`, 
      async () => {
        const station = displayStations.find(s => s.id === stationId);
        if (!station) {
          console.error("Station not found:", stationId);
          return;
        }
        
        if (!userLocation) {
          toast.error("Ative sua localização para calcular a rota");
          return;
        }
        
        // Selecionar a estação ao traçar rota
        if (selectedStation !== stationId) {
          setSelectedStation(stationId);
        }
        
        try {
          // Calcular a rota
          await calculateRoute(station.lat, station.lng);
        } finally {
          // Clear active calculation reference when done
          if (activeRouteCalc.current.stationId === stationId) {
            activeRouteCalc.current.stationId = null;
          }
        }
      },
      { stationId }
    );
  }, [displayStations, userLocation, selectedStation, calculateRoute, setSelectedStation, isRoutingLoading]);

  return {
    routeInfo,
    isRoutingLoading,
    handleRouteCalculation,
    clearRoute
  };
}
