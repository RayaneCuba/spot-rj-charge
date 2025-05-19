
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

interface NearbyStationsAlertProps {
  userLocation: [number, number] | null;
  showNearbyStations: boolean;
  onShowNearbyStations: () => void;
}

export function NearbyStationsAlert({
  userLocation,
  showNearbyStations,
  onShowNearbyStations
}: NearbyStationsAlertProps) {
  if (!userLocation) return null;
  
  return (
    <div className="flex items-center justify-between bg-muted p-4 rounded-lg mb-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Localização detectada</h3>
        <p className="text-xs text-muted-foreground">
          Exibindo estações de carregamento na região
        </p>
      </div>
      <Button 
        onClick={onShowNearbyStations} 
        variant="default" 
        className="gap-2"
        disabled={showNearbyStations}
      >
        <Navigation className="h-4 w-4" />
        {showNearbyStations ? 'Mostrando próximas' : 'Ver mais próximas'}
      </Button>
    </div>
  );
}
