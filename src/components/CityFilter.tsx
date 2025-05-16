
import { useState } from "react";
import { toast } from "sonner";
import { cities } from "@/data/stations";
import { FilterHeader } from "./city-filter/FilterHeader";
import { SearchForm } from "./city-filter/SearchForm";
import { AdvancedFilters } from "./city-filter/AdvancedFilters";
import { CHARGING_TYPES } from "./city-filter/constants";

interface CityFilterProps {
  onFilterChange: (city: string) => void;
}

export function CityFilter({ onFilterChange }: CityFilterProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"all" | "available" | "busy">("all");
  
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onFilterChange(city);
    toast.success(city === "all" ? "Mostrando todas as cidades" : `Filtrado por: ${city}`);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Simple search - if searchTerm is contained in any city name
      const matchingCity = cities.find(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingCity) {
        setSelectedCity(matchingCity);
        onFilterChange(matchingCity);
        toast.success(`Cidade encontrada: ${matchingCity}`);
      } else {
        toast.error("Cidade não encontrada");
      }
    }
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(current => {
      if (current.includes(type)) {
        return current.filter(t => t !== type);
      } else {
        return [...current, type];
      }
    });
  };
  
  const resetFilters = () => {
    setSelectedTypes([]);
    setAvailability("all");
    toast.success("Filtros resetados");
  };
  
  const applyFilters = () => {
    toast.success("Filtros aplicados");
    // Aqui você implementaria a lógica para filtrar por tipo e disponibilidade
    setShowFilters(false);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="bg-white dark:bg-dark-blue rounded-lg shadow-lg p-6 mb-6">
      <FilterHeader 
        title="Encontre eletropostos por cidade"
        description="Selecione uma cidade ou digite para buscar"
      />
      
      <SearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        handleCityChange={handleCityChange}
        handleSearch={handleSearch}
        toggleFilters={toggleFilters}
      />

      <AdvancedFilters
        showFilters={showFilters}
        chargingTypes={CHARGING_TYPES}
        selectedTypes={selectedTypes}
        availability={availability}
        handleTypeToggle={handleTypeToggle}
        setAvailability={setAvailability}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
      />
    </div>
  );
}
