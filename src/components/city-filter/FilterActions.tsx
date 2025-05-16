
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FilterActionsProps {
  resetFilters: () => void;
  applyFilters: () => void;
}

export function FilterActions({ resetFilters, applyFilters }: FilterActionsProps) {
  return (
    <div className="mt-4 flex justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={resetFilters}
        className="mr-2"
      >
        Limpar Filtros
      </Button>
      <Button 
        type="button" 
        onClick={applyFilters}
      >
        Aplicar Filtros
      </Button>
    </div>
  );
}
