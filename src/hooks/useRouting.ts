
import { useState } from 'react';
import { toast } from 'sonner';
import { RouteInfo } from '@/types/Station';

interface UseRoutingProps {
  userLocation: [number, number] | null;
}

export function useRouting({ userLocation }: UseRoutingProps) {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const calculateRoute = async (destLat: number, destLng: number) => {
    if (!userLocation) {
      toast.error("Ative sua localização para calcular a rota");
      return null;
    }

    setIsRoutingLoading(true);
    setRouteError(null);

    try {
      // Usando a API OpenRouteService para cálculo de rotas
      const apiKey = "5b3ce3597851110001cf624844c28bf73a3442c3b7c25a8966d50bd1"; // Chave demo pública do OpenRouteService
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${userLocation[1]},${userLocation[0]}&end=${destLng},${destLat}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "Erro ao calcular rota");
      }

      if (!data.features || data.features.length === 0) {
        throw new Error("Nenhuma rota encontrada");
      }

      const feature = data.features[0];
      const route: RouteInfo = {
        distance: feature.properties.summary.distance / 1000, // Convertendo para km
        duration: Math.round(feature.properties.summary.duration / 60), // Convertendo para minutos
        geometry: feature.geometry
      };

      setRouteInfo(route);
      toast.success(`Rota calculada: ${route.distance.toFixed(1)} km (${route.duration} min)`);
      return route;
    } catch (error) {
      console.error("Erro ao calcular rota:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao calcular rota";
      setRouteError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsRoutingLoading(false);
    }
  };

  const clearRoute = () => {
    setRouteInfo(null);
  };

  return {
    routeInfo,
    isRoutingLoading,
    routeError,
    calculateRoute,
    clearRoute
  };
}
