
import React from "react";
import { TypeFilters } from "./TypeFilters";
import { AvailabilityFilters } from "./AvailabilityFilters";
import { FilterActions } from "./FilterActions";

interface AdvancedFiltersProps {
  showFilters: boolean;
  chargingTypes: string[];
  selectedTypes: string[];
  availability: "all" | "available" | "busy";
  handleTypeToggle: (type: string) => void;
  setAvailability: (value: "all" | "available" | "busy") => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

export function AdvancedFilters({
  showFilters,
  chargingTypes,
  selectedTypes,
  availability,
  handleTypeToggle,
  setAvailability,
  resetFilters,
  applyFilters
}: AdvancedFiltersProps) {
  if (!showFilters) return null;

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <h4 className="font-montserrat font-medium mb-2">Filtros Adicionais</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TypeFilters 
          chargingTypes={chargingTypes}
          selectedTypes={selectedTypes}
          handleTypeToggle={handleTypeToggle}
        />
        
        <AvailabilityFilters 
          availability={availability}
          setAvailability={setAvailability}
        />
      </div>
      
      <FilterActions
        resetFilters={resetFilters}
        applyFilters={applyFilters}
      />
    </div>
  );
}
