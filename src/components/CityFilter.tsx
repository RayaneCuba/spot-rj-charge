
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";
import { cities, chargingStations } from "@/data/stations";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface CityFilterProps {
  onFilterChange: (city: string) => void;
}

const chargingTypes = [
  "Rápido (150kW)",
  "Rápido (100kW)",
  "Rápido (50kW)",
  "Semi-rápido (22kW)",
  "Semi-rápido (11kW)",
  "Lento (7kW)"
];

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
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 md:flex-none"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </form>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-montserrat font-medium mb-2">Filtros Adicionais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setSelectedTypes([]);
                setAvailability("all");
                toast.success("Filtros resetados");
              }}
              className="mr-2"
            >
              Limpar Filtros
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                toast.success("Filtros aplicados");
                // Aqui você implementaria a lógica para filtrar por tipo e disponibilidade
                setShowFilters(false);
              }}
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
