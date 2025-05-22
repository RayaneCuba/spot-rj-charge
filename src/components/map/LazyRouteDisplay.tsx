
import { Suspense, lazy, useEffect, useState } from 'react';
import { RouteInfo } from '@/types/Station';
import { Loader2 } from 'lucide-react';

const RouteDisplay = lazy(() => 
  import('./RouteDisplay').then(module => ({ default: module.RouteDisplay }))
);

interface LazyRouteDisplayProps {
  routeInfo: RouteInfo | null;
}

export function LazyRouteDisplay({ routeInfo }: LazyRouteDisplayProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    // Só carrega a rota quando houver dados de rota disponíveis
    if (routeInfo && routeInfo.geometry) {
      setShouldLoad(true);
    } else {
      setShouldLoad(false);
    }
  }, [routeInfo]);
  
  if (!shouldLoad) return null;
  
  return (
    <Suspense fallback={
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">Carregando rota...</span>
        </div>
      </div>
    }>
      <RouteDisplay routeInfo={routeInfo} />
    </Suspense>
  );
}
