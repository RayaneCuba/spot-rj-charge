
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Não foi possível carregar suas estações favoritas');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Salvar favoritos no localStorage sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading]);

  // Verificar se uma estação é favorita
  const isFavorite = (stationId: number): boolean => {
    return favorites.some(station => station.id === stationId);
  };

  // Adicionar estação aos favoritos
  const addFavorite = (station: Station) => {
    if (!isFavorite(station.id)) {
      setFavorites(prev => [...prev, station]);
      toast.success(`${station.name} adicionada aos favoritos`);
    }
  };

  // Remover estação dos favoritos
  const removeFavorite = (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (station) {
      setFavorites(prev => prev.filter(station => station.id !== stationId));
      toast.success(`${station.name} removida dos favoritos`);
    }
  };

  // Toggle favorito (adiciona se não existir, remove se existir)
  const toggleFavorite = (station: Station) => {
    if (isFavorite(station.id)) {
      removeFavorite(station.id);
    } else {
      addFavorite(station);
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite
  };
}
