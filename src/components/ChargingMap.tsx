
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { chargingStations, cities } from "@/data/stations";

// Mock mapboxgl until we get a real token
const mockMapboxgl = {
  Map: class {
    on(event: string, callback: () => void) {
      setTimeout(callback, 500);
      return this;
    }
    addControl() { return this; }
    remove() {}
  }
};

interface ChargingStation {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: string;
  hours: string;
}

export function ChargingMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapToken, setMapToken] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  
  // Filter stations based on selected city
  const filteredStations = selectedCity === "all" 
    ? chargingStations 
    : chargingStations.filter(station => station.city === selectedCity);
  
  useEffect(() => {
    if (!mapContainer.current || !mapToken) return;
    
    try {
      // This is where we'd initialize the map with the actual Mapbox token
      // For now, we'll just simulate the map loading
      const map = new mockMapboxgl.Map();
      
      map.on('load', () => {
        setMapLoaded(true);
        
        // In a real implementation, this is where we would add markers for each station
        // For now, we'll just simulate that the map is loaded
      });
      
      return () => {
        map.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [mapToken, mapContainer]);
  
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] rounded-lg overflow-hidden bg-muted">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-xs">
        <Alert className="bg-background/90 backdrop-blur-sm">
          <AlertTitle>Cobertura limitada</AlertTitle>
          <AlertDescription>
            Atualmente, nossa cobertura está disponível em todo o estado do Rio de Janeiro, onde há eletropostos.
          </AlertDescription>
        </Alert>
        
        <Badge className="self-start bg-primary text-primary-foreground">
          Missão RJ completa! 🏆
        </Badge>
      </div>
      
      <div className="absolute top-4 right-4 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-background/90 backdrop-blur-sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar por cidade
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <select
                  id="city"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="all">Todas as cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {!mapToken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted p-6">
          <p className="mb-4 text-center">Para visualizar o mapa de eletropostos, insira seu token do Mapbox:</p>
          <div className="flex w-full max-w-sm gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => setMapToken(mapToken || "demo-token")}
              disabled={!mapToken}
            >
              Carregar mapa
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Obtenha seu token gratuito em{" "}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      )}
      
      <div ref={mapContainer} className="h-full w-full" />
      
      {mapToken && !mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-lg font-semibold">Carregando mapa...</p>
            <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
          </div>
        </div>
      )}
      
      {/* Station list when map isn't loaded */}
      {mapToken && mapLoaded && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-h-60 overflow-y-auto rounded-lg bg-background/90 backdrop-blur-sm p-4">
          <h3 className="mb-2 text-lg font-semibold">
            {filteredStations.length} Eletropostos {selectedCity !== "all" ? `em ${selectedCity}` : "no Rio de Janeiro"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStations.map((station) => (
              <Card 
                key={station.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedStation(station)}
              >
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">{station.name}</CardTitle>
                  <CardDescription className="text-xs">{station.city}</CardDescription>
                </CardHeader>
                <CardFooter className="py-2 text-xs flex justify-between">
                  <span>{station.type}</span>
                  <span>{station.hours}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {selectedStation && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedStation.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedStation.city}</span>
                    </div>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStation(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Tipo de carregador:</strong> {selectedStation.type}
                </div>
                <div>
                  <strong>Horário de funcionamento:</strong> {selectedStation.hours}
                </div>
                <div>
                  <strong>Coordenadas:</strong> {selectedStation.lat.toFixed(6)}, {selectedStation.lng.toFixed(6)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Navegar até este eletroposto
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
