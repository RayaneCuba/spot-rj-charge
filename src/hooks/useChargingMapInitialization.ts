
import { useEffect, useCallback } from "react";
import { trackPerformance } from "@/lib/performance-monitoring";

interface UseChargingMapInitializationProps {
  setLoadingState: (loading: boolean) => void;
  setErrorState: (error: boolean) => void;
}

export function useChargingMapInitialization({
  setLoadingState,
  setErrorState
}: UseChargingMapInitializationProps) {
  
  // Simular carregamento inicial para garantir que tudo está pronto
  useEffect(() => {
    const startTime = performance.now();
    
    const timer = setTimeout(() => {
      setLoadingState(false);
      
      // Medir tempo de inicialização
      const loadTime = performance.now() - startTime;
      trackPerformance("chargingMap.initialLoad", loadTime);
      
      // Log initial map load time for debugging
      console.debug(`Map initialization time: ${loadTime.toFixed(2)}ms`);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [setLoadingState]);

  // Reset error state when component initializes
  useEffect(() => {
    setErrorState(false);
  }, [setErrorState]);

  return {
    // Additional initialization functions can be added here
  };
}
