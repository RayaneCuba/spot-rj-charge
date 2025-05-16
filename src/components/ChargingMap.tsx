
import { useState } from "react";
import { chargingStations } from "@/data/stations";
import { MapContainer } from "./map/MapContainer";
import { StationList } from "./stations/StationList";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const filteredStations = cityFilter && cityFilter !== "all"
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;

  const handleStationSelect = (stationId: number) => {
    setSelectedStation(stationId);
    
    // Notificar seleção de estação
    const station = chargingStations.find(s => s.id === stationId);
    if (station) {
      toast.success(`Estação selecionada: ${station.name}`);
    }
  };
  
  // Simular carregamento inicial para garantir que tudo está pronto
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-center p-6">
          <p className="text-red-500 font-semibold text-lg mb-2">Erro ao carregar o mapa</p>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível carregar os dados das estações de carregamento.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MapContainer 
        stations={filteredStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect}
      />
      
      <StationList 
        stations={filteredStations} 
        selectedStation={selectedStation} 
        onSelectStation={handleStationSelect} 
      />
    </div>
  );
}
