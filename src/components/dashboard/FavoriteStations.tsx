
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Station } from "@/types/Station";
import { useNavigate } from "react-router-dom";

export function FavoriteStations() {
  const navigate = useNavigate();
  
  // Mock de estações favoritas - será substituído por dados reais posteriormente
  const favorites: Station[] = [
    {
      id: 1,
      name: "Eletroposto Shopping Rio Sul",
      city: "Rio de Janeiro",
      lat: -22.967,
      lng: -43.186,
      type: "Rápido",
      hours: "24h",
      connectorTypes: ["Tipo 2", "CCS"]
    },
    {
      id: 2,
      name: "Eletroposto Barra Shopping",
      city: "Rio de Janeiro",
      lat: -22.999,
      lng: -43.365,
      type: "Semi-rápido",
      hours: "10h-22h",
      connectorTypes: ["CHAdeMO", "Tipo 2"]
    }
  ];

  const handleViewAllClick = () => {
    navigate("/");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Star className="h-5 w-5 mr-2 text-amber-500" />
            Estações Favoritas
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAllClick}
            className="text-xs"
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {favorites.length > 0 ? (
          <div className="space-y-3">
            {favorites.map(station => (
              <div 
                key={station.id} 
                className="flex items-start justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div>
                  <h4 className="font-medium text-sm">{station.name}</h4>
                  <p className="text-xs text-muted-foreground">{station.city}</p>
                </div>
                <div className="text-xs text-muted-foreground min-w-[50px] text-right">
                  {station.type}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Nenhuma estação favorita ainda.</p>
            <Button 
              variant="link" 
              size="sm"
              onClick={handleViewAllClick}
              className="mt-2"
            >
              Explore o mapa para adicionar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
