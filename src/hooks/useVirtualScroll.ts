
import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseVirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3
}: UseVirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex: visibleRange.startIndex
  };
}
