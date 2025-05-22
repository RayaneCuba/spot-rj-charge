
import { useState, useCallback } from "react";
import { Station } from "@/types/Station";
import { toast } from "sonner";

export function useChargingMapState() {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Usar useCallback para funções passadas como props
  const handleStationSelect = useCallback((stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    toast.success(`Estação selecionada: #${stationId}`);
  }, []);

  // Função para recarregar a página em caso de erro
  const handleRetry = useCallback(() => window.location.reload(), []);

  // Setter para loading
  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Setter para erro
  const setErrorState = useCallback((error: boolean) => {
    setHasError(error);
  }, []);

  return {
    selectedStation,
    isLoading,
    hasError,
    handleStationSelect,
    handleRetry,
    setLoadingState,
    setErrorState,
    setSelectedStation
  };
}
