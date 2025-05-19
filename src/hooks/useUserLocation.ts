
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type UserLocation = [number, number] | null;

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<UserLocation>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo seu navegador');
      toast.error('Geolocalização não suportada pelo seu navegador');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLoading(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setError('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        toast.error('Não foi possível obter sua localização');
        setIsLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { userLocation, isLoading, error, requestLocation };
}
