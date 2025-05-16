
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface AvailabilityFiltersProps {
  availability: "all" | "available" | "busy";
  setAvailability: (value: "all" | "available" | "busy") => void;
}

export function AvailabilityFilters({ availability, setAvailability }: AvailabilityFiltersProps) {
  return (
    <div>
      <h5 className="text-sm font-medium mb-2">Disponibilidade</h5>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="availability-all" 
            checked={availability === "all"}
            onCheckedChange={() => setAvailability("all")}
          />
          <label 
            htmlFor="availability-all"
            className="text-sm cursor-pointer"
          >
            Todos
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="availability-available" 
            checked={availability === "available"}
            onCheckedChange={() => setAvailability("available")}
          />
          <label 
            htmlFor="availability-available"
            className="text-sm cursor-pointer"
          >
            Disponíveis agora
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="availability-busy" 
            checked={availability === "busy"}
            onCheckedChange={() => setAvailability("busy")}
          />
          <label 
            htmlFor="availability-busy"
            className="text-sm cursor-pointer"
          >
            Ocupados
          </label>
        </div>
      </div>
    </div>
  );
}
