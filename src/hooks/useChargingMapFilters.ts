
import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Station } from "@/types/Station";
import { getUniqueConnectorTypes } from "@/utils/stationUtils";

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
  
  // Use utility function for connector types
  const uniqueConnectorTypes = useMemo(() => 
    getUniqueConnectorTypes(allStations),
    [allStations]
  );

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
