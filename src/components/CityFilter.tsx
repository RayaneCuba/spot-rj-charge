
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { cities } from "@/data/stations";

interface CityFilterProps {
  onFilterChange: (city: string) => void;
}

export function CityFilter({ onFilterChange }: CityFilterProps) {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onFilterChange(city);
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
      }
    }
  };
  
  return (
    <div className="bg-white dark:bg-dark-blue rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-montserrat font-semibold mb-2">Encontre eletropostos por cidade</h3>
        <p className="text-muted-foreground text-sm">
          Selecione uma cidade ou digite para buscar
        </p>
      </div>
      
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
              <SelectItem value="">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:self-end md:pb-0 pt-6 md:pt-0">
          <Button type="submit" className="w-full">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}
