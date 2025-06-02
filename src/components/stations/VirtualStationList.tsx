
import { memo, useRef, useEffect } from 'react';
import { Station } from '@/types/Station';
import { StationCard } from './StationCard';
import { useVirtualScroll } from '@/hooks/useVirtualScroll';

interface VirtualStationListProps {
  stations: Station[];
  selectedStation: number | null;
  onSelectStation: (id: number) => void;
  onRouteClick?: (id: number) => void;
  containerHeight?: number;
}

const ITEM_HEIGHT = 200; // Altura estimada de cada StationCard

export const VirtualStationList = memo(function VirtualStationList({
  stations,
  selectedStation,
  onSelectStation,
  onRouteClick,
  containerHeight = 600
}: VirtualStationListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex
  } = useVirtualScroll({
    items: stations,
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: 2
  });

  // Auto-scroll to selected station
  useEffect(() => {
    if (selectedStation && containerRef.current) {
      const selectedIndex = stations.findIndex(s => s.id === selectedStation);
      if (selectedIndex !== -1) {
        const scrollPosition = selectedIndex * ITEM_HEIGHT;
        containerRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedStation, stations]);

  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Nenhuma estação encontrada com os filtros aplicados</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {visibleItems.map((station, index) => (
              <div key={station.id} style={{ minHeight: ITEM_HEIGHT }}>
                <StationCard
                  station={station}
                  isSelected={selectedStation === station.id}
                  onClick={onSelectStation}
                  onRouteClick={onRouteClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
