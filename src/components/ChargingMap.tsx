
import { useState, useEffect, useCallback, useMemo, memo, Suspense } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";
import { toast } from "sonner";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useStations } from "@/hooks/useStations";
import { useRouting } from "@/hooks/useRouting";
import { NearbyStationsAlert } from "./stations/NearbyStationsAlert";
import { LoadingState } from "./stations/LoadingState";
import { ErrorState } from "./stations/ErrorState";
import { FilterPanel } from "./filters/FilterPanel";
import { Station } from "@/types/Station";
import { trackPerformance } from "@/lib/performance-monitoring";
import { measurePerformanceAsync } from "@/lib/performance-monitoring";

interface ChargingMapProps {
  cityFilter?: string;
}

// Componentes memoizados para evitar re-renderizações desnecessárias
const MemoizedStationList = memo(StationList);
const MemoizedFilterPanel = memo(FilterPanel);
const MemoizedNearbyStationsAlert = memo(NearbyStationsAlert);

export const ChargingMap = memo(function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  const { userLocation } = useUserLocation();
  
  // Usar useMemo para evitar recálculos desnecessários
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

  const { 
    routeInfo, 
    isRoutingLoading, 
    calculateRoute, 
    clearRoute 
  } = useRouting({ userLocation });

  // Memoizar cálculos que não mudam frequentemente
  const uniqueConnectorTypes = useMemo(() => 
    Array.from(
      new Set(
        allStations
          .flatMap(station => station.connectorTypes || [])
          .filter(Boolean)
      )
    ),
    [allStations]
  );

  // Usar useCallback para funções passadas como props
  const handleStationSelect = useCallback((stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    const station = displayStations.find(s => s.id === stationId);
    if (station) {
      toast.success(`Estação selecionada: ${station.name}`);
      clearRoute(); // Limpar rota ao selecionar nova estação
    }
  }, [displayStations, clearRoute]);

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
  }, [displayStations, userLocation, selectedStation, calculateRoute]);
  
  // Aplicar filtros usando useCallback
  const handleFilterChange = useCallback((newFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => {
    updateFilters(newFilters);
    toast.success("Filtros aplicados");
  }, [updateFilters]);
  
  // Simular carregamento inicial para garantir que tudo está pronto
  useEffect(() => {
    const startTime = performance.now();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Medir tempo de inicialização
      const loadTime = performance.now() - startTime;
      trackPerformance("chargingMap.initialLoad", loadTime);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Função para recarregar a página em caso de erro
  const handleRetry = useCallback(() => window.location.reload(), []);

  // Memoizar conteúdo principal para evitar re-renderizações
  const mapContent = useMemo(() => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (hasError) {
      return <ErrorState onRetry={handleRetry} />;
    }

    return (
      <>
        <MemoizedNearbyStationsAlert
          userLocation={userLocation}
          showNearbyStations={showNearbyStations}
          onShowNearbyStations={handleShowNearbyStations}
        />
        
        <MemoizedFilterPanel 
          onFilterChange={handleFilterChange}
          connectorTypes={uniqueConnectorTypes}
          initialFilters={filters}
        />
        
        {isRoutingLoading && (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md mb-4">
            <p className="text-sm text-center">Calculando rota...</p>
          </div>
        )}
        
        <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Carregando mapa...</div>}>
          <MapContainer 
            stations={displayStations} 
            selectedStation={selectedStation} 
            onSelectStation={handleStationSelect}
            routeInfo={routeInfo}
          />
        </Suspense>
        
        <MemoizedStationList 
          stations={displayStations} 
          selectedStation={selectedStation} 
          onSelectStation={handleStationSelect}
          onRouteClick={handleRouteCalculation}
        />
      </>
    );
  }, [
    isLoading, 
    hasError, 
    handleRetry,
    userLocation, 
    showNearbyStations, 
    handleShowNearbyStations, 
    handleFilterChange, 
    uniqueConnectorTypes,
    filters, 
    isRoutingLoading, 
    displayStations, 
    selectedStation, 
    handleStationSelect, 
    routeInfo,
    handleRouteCalculation
  ]);

  return (
    <div className="space-y-6">
      {mapContent}
    </div>
  );
});
