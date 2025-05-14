import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { chargingStations } from "@/data/stations";

interface ChargingMapProps {
  cityFilter?: string;
}

export function ChargingMap({ cityFilter = "" }: ChargingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  
  useEffect(() => {
    // This is a placeholder for the real map implementation
    console.log("Map should be rendered here with filter:", cityFilter);
    
    // You would integrate with a map library here
    // For example, if using Mapbox:
    // const map = new mapboxgl.Map({
    //   container: mapRef.current!,
    //   style: 'mapbox://styles/mapbox/light-v10',
    //   center: [-43.2096, -22.9035], // Rio de Janeiro
    //   zoom: 9
    // });
  }, [cityFilter]);
  
  const filteredStations = cityFilter
    ? chargingStations.filter(station => station.city === cityFilter)
    : chargingStations;
  
  return (
    <div className="space-y-6">
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-muted-foreground"
      >
        Mapa interativo seria renderizado aqui
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <Card 
            key={station.id} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${selectedStation === station.id ? 'border-electric-green' : ''}`}
            onClick={() => setSelectedStation(station.id)}
          >
            <CardContent className="p-4">
              <h3 className="font-montserrat font-semibold text-lg">{station.name}</h3>
              <p className="text-muted-foreground text-sm">{station.city}</p>
              <div className="mt-2 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span>{station.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horário:</span>
                  <span>{station.hours}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
