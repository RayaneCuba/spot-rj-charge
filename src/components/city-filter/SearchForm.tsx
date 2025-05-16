
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";
import { cities } from "@/data/stations";

interface SearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCity: string;
  handleCityChange: (city: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  toggleFilters: () => void;
}

export function SearchForm({
  searchTerm,
  setSearchTerm,
  selectedCity,
  handleCityChange,
  handleSearch,
  toggleFilters
}: SearchFormProps) {
  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="city-search">Pesquisar por cidade</Label>
        <div className="relative mt-1">
          <Input
            id="city-search"
            placeholder="Digite o nome da cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <MapPin className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1">
        <Label htmlFor="city-select">Ou selecione uma cidade</Label>
        <Select value={selectedCity} onValueChange={handleCityChange}>
          <SelectTrigger id="city-select" className="mt-1">
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:self-end md:pb-0 pt-6 md:pt-0 flex gap-2">
        <Button type="submit" className="flex-1 md:flex-none">
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={toggleFilters}
          className="flex-1 md:flex-none"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>
    </form>
  );
}
