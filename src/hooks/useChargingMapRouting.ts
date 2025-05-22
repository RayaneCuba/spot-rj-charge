
import { useCallback } from "react";
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

  // Função para calcular rota para a estação usando useCallback
  const handleRouteCalculation = useCallback(async (stationId: number) => {
    // Usar função de medição de performance para operações assíncronas
    return measurePerformanceAsync(
      `routeCalculation.${stationId}`, 
      async () => {
        const station = displayStations.find(s => s.id === stationId);
        if (!station) return;
        
        if (!userLocation) {
          toast.error("Ative sua localização para calcular a rota");
          return;
        }
        
        // Selecionar a estação ao traçar rota
        if (selectedStation !== stationId) {
          setSelectedStation(stationId);
        }
        
        // Calcular a rota
        await calculateRoute(station.lat, station.lng);
      },
      { stationId }
    );
  }, [displayStations, userLocation, selectedStation, calculateRoute, setSelectedStation]);

  return {
    routeInfo,
    isRoutingLoading,
    handleRouteCalculation,
    clearRoute
  };
}
