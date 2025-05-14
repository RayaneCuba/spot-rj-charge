
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface StationCardProps {
  station: {
    id: number;
    name: string;
    city: string;
    type: string;
    hours: string;
  };
  isSelected: boolean;
  onClick: (id: number) => void;
}

export function StationCard({ station, isSelected, onClick }: StationCardProps) {
  return (
    <Card 
      key={station.id} 
      className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-primary' : ''}`}
      onClick={() => onClick(station.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className={`h-5 w-5 mt-1 ${isSelected ? 'text-primary' : 'text-secondary'}`} />
          <div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
