
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Station } from "@/types/Station";

interface UseChargingMapFiltersProps {
  allStations: Station[];
  updateFilters: (newFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => void;
  filters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  };
}

export function useChargingMapFilters({
  allStations,
  updateFilters,
  filters
}: UseChargingMapFiltersProps) {
  
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

  // Aplicar filtros usando useCallback
  const handleFilterChange = useCallback((newFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => {
    updateFilters(newFilters);
    toast.success("Filtros aplicados");
  }, [updateFilters]);

  return {
    uniqueConnectorTypes,
    handleFilterChange
  };
}
