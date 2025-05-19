
import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface FilterPanelProps {
  onFilterChange: (filters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  }) => void;
  connectorTypes: string[];
  initialFilters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  };
}

export function FilterPanel({ onFilterChange, connectorTypes, initialFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialFilters.types);
  const [availability, setAvailability] = useState<"all" | "available" | "busy">(initialFilters.availability);
  const [maxDistance, setMaxDistance] = useState<number | undefined>(initialFilters.maxDistance || 50);
  const [useDistanceFilter, setUseDistanceFilter] = useState<boolean>(initialFilters.maxDistance !== undefined);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  const applyFilters = () => {
    onFilterChange({
      types: selectedTypes,
      availability,
      maxDistance: useDistanceFilter ? maxDistance : undefined
    });
  };
  
  const resetFilters = () => {
    setSelectedTypes([]);
    setAvailability("all");
    setMaxDistance(50);
    setUseDistanceFilter(false);
    
    onFilterChange({
      types: [],
      availability: "all",
      maxDistance: undefined
    });
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
    <div className="mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={togglePanel}
        className="mb-2 w-full md:w-auto"
      >
        <Filter className="mr-2 h-4 w-4" />
        {isOpen ? "Ocultar Filtros" : "Filtros Avançados"}
      </Button>
      
      {isOpen && (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtros de Estações</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="connectors">
              <TabsList className="mb-4">
                <TabsTrigger value="connectors">Conectores</TabsTrigger>
                <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
                <TabsTrigger value="distance">Distância</TabsTrigger>
              </TabsList>
              
              <TabsContent value="connectors">
                <div className="grid grid-cols-2 gap-2">
                  {connectorTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                      />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="availability">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="availability-all" 
                      checked={availability === "all"}
                      onCheckedChange={() => setAvailability("all")}
                    />
                    <Label htmlFor="availability-all">Todas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="availability-available" 
                      checked={availability === "available"}
                      onCheckedChange={() => setAvailability("available")}
                    />
                    <Label htmlFor="availability-available">Disponíveis agora</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="availability-busy" 
                      checked={availability === "busy"}
                      onCheckedChange={() => setAvailability("busy")}
                    />
                    <Label htmlFor="availability-busy">Ocupados</Label>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="distance">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      id="use-distance-filter"
                      checked={useDistanceFilter}
                      onCheckedChange={setUseDistanceFilter}
                    />
                    <Label htmlFor="use-distance-filter">Filtrar por distância máxima</Label>
                  </div>
                  
                  {useDistanceFilter && (
                    <div className="space-y-6">
                      <div>
                        <Slider
                          defaultValue={[maxDistance || 50]}
                          max={100}
                          step={5}
                          onValueChange={value => setMaxDistance(value[0])}
                          disabled={!useDistanceFilter}
                        />
                      </div>
                      <div className="text-center font-medium">
                        {maxDistance} km
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4" />
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
              >
                Limpar
              </Button>
              <Button 
                size="sm"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
