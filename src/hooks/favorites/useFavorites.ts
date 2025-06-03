
import { useFavoritesState } from './useFavoritesState';
import { useFavoritesSync } from './useFavoritesSync';
import { useFavoritesOperations } from './useFavoritesOperations';

export function useFavorites() {
  const { favorites, setFavorites, isLoading, isVisitor } = useFavoritesState();
  const syncStatus = useFavoritesSync(setFavorites, isVisitor);
  const operations = useFavoritesOperations(favorites, setFavorites, isVisitor);

  return {
    favorites,
    isLoading,
    ...operations,
    syncStatus
  };
}
