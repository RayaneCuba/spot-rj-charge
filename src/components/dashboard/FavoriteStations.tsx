
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { SyncStatus } from "@/components/ui/SyncStatus";

export function FavoriteStations() {
  const navigate = useNavigate();
  const { favorites, removeFavorite, syncStatus } = useFavorites();
  
  const handleViewAllClick = () => {
    navigate("/");
  };

  const handleRemoveFavorite = (stationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(stationId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Star className="h-5 w-5 mr-2 text-amber-500" />
            Estações Favoritas
          </CardTitle>
          
          <div className="flex items-center gap-3">
            <SyncStatus 
              isOnline={syncStatus.isOnline}
              isSyncing={syncStatus.isSyncing}
              lastSyncAttempt={syncStatus.lastSyncAttempt}
              lastSuccessfulSync={syncStatus.lastSuccessfulSync}
            />
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewAllClick}
              className="text-xs"
            >
              Ver todas
            </Button>
          </div>
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
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground min-w-[50px] text-right">
                    {station.type}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-amber-500 hover:text-amber-600"
                    onClick={(e) => handleRemoveFavorite(station.id, e)}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </Button>
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
