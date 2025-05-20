
import { Station } from '@/types/Station';

// Verificar se uma estação é favorita
export const isStationFavorite = (favorites: Station[], stationId: number): boolean => {
  return favorites.some(station => station.id === stationId);
};
