
import { useFavoritesState } from './useFavoritesState';
import { useFavoritesSync } from './useFavoritesSync';
import { useFavoritesOperations } from './useFavoritesOperations';

export function useFavorites() {
  const { favorites, updateFavorites, isLoading, isVisitor } = useFavoritesState();
  const syncStatus = useFavoritesSync(updateFavorites, isVisitor);
  const operations = useFavoritesOperations(favorites, updateFavorites, isVisitor);

  return {
    favorites,
    isLoading,
    ...operations,
    syncStatus
  };
}
