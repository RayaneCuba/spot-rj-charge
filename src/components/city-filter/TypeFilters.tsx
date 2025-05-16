
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface TypeFiltersProps {
  chargingTypes: string[];
  selectedTypes: string[];
  handleTypeToggle: (type: string) => void;
}

export function TypeFilters({ chargingTypes, selectedTypes, handleTypeToggle }: TypeFiltersProps) {
  return (
    <div>
      <h5 className="text-sm font-medium mb-2">Tipo de Carregador</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {chargingTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox 
              id={`type-${type}`} 
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleTypeToggle(type)}
            />
            <label 
              htmlFor={`type-${type}`}
              className="text-sm cursor-pointer"
            >
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
