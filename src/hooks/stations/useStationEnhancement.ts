
import { useMemo } from 'react';
import { Station } from '@/types/Station';

interface UseStationEnhancementProps {
  stations: Station[];
  cityFilter: string;
}

export function useStationEnhancement({ stations, cityFilter }: UseStationEnhancementProps) {
  const enhancedStations = useMemo(() => {
    let filteredStations = cityFilter && cityFilter !== "all"
      ? stations.filter(station => station.city === cityFilter)
      : stations;
    
    // Add simulated availability and connector types for demo
    return filteredStations.map(station => {
      const random = Math.random();
      let availability: "disponível" | "ocupado" | "offline";
      
      if (random < 0.7) {
        availability = "disponível";
      } else if (random < 0.9) {
        availability = "ocupado";
      } else {
        availability = "offline";
      }
      
      // Add connector types based on station type
      const connectorTypes = [];
      if (station.type.includes("150kW") || station.type.includes("100kW")) {
        connectorTypes.push("CCS");
        if (Math.random() > 0.5) connectorTypes.push("CHAdeMO");
      } else if (station.type.includes("50kW")) {
        connectorTypes.push("CCS");
        connectorTypes.push("CHAdeMO");
      } else if (station.type.includes("22kW") || station.type.includes("11kW")) {
        connectorTypes.push("Tipo 2");
        if (Math.random() > 0.7) connectorTypes.push("Tipo 1");
      } else {
        connectorTypes.push("Tipo 2");
      }
      
      return { ...station, availability, connectorTypes };
    });
  }, [stations, cityFilter]);

  return { enhancedStations };
}
