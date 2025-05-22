
import { useState, useCallback, memo } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { useStations } from '@/hooks/useStations';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useError } from '@/context/ErrorContext';
import { LoadingState, ErrorState } from '@/components/ui/loading-states';
import { StationList } from './StationList';
import { Station } from '@/types/Station';

interface StationsLoaderProps {
  cityFilter: string;
}

export const StationsLoader = memo(function StationsLoader({ cityFilter }: StationsLoaderProps) {
  const { userLocation } = useUserLocation();
  const { reportNetworkError } = useError();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);

  // Simulação de uma função que busca estações
  const fetchStations = useCallback(async (): Promise<Station[]> => {
    // Esta é uma simulação - em produção, aqui seria uma chamada API real
    
    // Simulando uma chance de erro aleatória para teste
    if (Math.random() < 0.1) {
      throw new Error("Falha ao carregar estações");
    }
    
    // Simulando delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Retorna dados mockados ou do cache local
    return [
      {
        id: 1,
        name: "Estação Centro",
        lat: -23.5505,
        lng: -46.6333,
        type: "150kW",
        city: "São Paulo",
        hours: "24h"  // Added required hours property
      },
      {
        id: 2,
        name: "Estação Shopping",
        lat: -23.5605,
        lng: -46.6433,
        type: "50kW",
        city: "São Paulo",
        hours: "10h - 22h"  // Added required hours property
      },
      // Mais estações mockadas iriam aqui
    ];
  }, []);
  
  // Usando nosso hook useAsync para gerenciamento de estado
  const { 
    data: stations, 
    isLoading, 
    isError, 
    error, 
    retry 
  } = useAsync<Station[]>(
    fetchStations,
    {
      onError: (err) => {
        if (err.message.includes('conexão')) {
          reportNetworkError(retry);
        }
      },
      errorMessage: "Falha ao carregar estações de carregamento",
      autoRetry: true,
      maxRetries: 2,
    },
    [cityFilter] // Refetch quando o filtro de cidade mudar
  );
  
  // Processar estações quando carregadas com sucesso
  const { displayStations } = useStations({
    stations: stations || [],
    userLocation,
    cityFilter
  });

  // Handler for selecting a station usando useCallback
  const handleSelectStation = useCallback((id: number) => {
    setSelectedStation(id);
  }, []);

  // Renderização baseada no estado
  if (isLoading) {
    return <LoadingState title="Carregando estações" description="Buscando estações próximas" />;
  }
  
  if (isError) {
    return (
      <ErrorState
        title="Falha ao carregar estações"
        description={error?.message || "Não foi possível carregar as estações de carregamento."}
        onRetry={retry}
      />
    );
  }
  
  if (!stations || stations.length === 0) {
    return <ErrorState title="Nenhuma estação encontrada" description="Tente mudar seus filtros de busca." variant="inline" />;
  }
  
  return (
    <StationList 
      stations={displayStations} 
      selectedStation={selectedStation}
      onSelectStation={handleSelectStation}
      // onRouteClick is optional according to the interface, so we don't need to provide it
    />
  );
});
