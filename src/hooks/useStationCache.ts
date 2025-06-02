
import { useState, useEffect, useMemo } from 'react';
import { Station } from '@/types/Station';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface StationCache {
  stations: Station[];
  filters: {
    types: string[];
    availability: "all" | "available" | "busy";
    maxDistance?: number;
  };
  userLocation: [number, number] | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const CACHE_KEY = 'electrospot_station_cache';

export function useStationCache() {
  const [cache, setCache] = useState<CacheEntry<StationCache> | null>(null);

  // Carregar cache do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CacheEntry<StationCache>;
        if (Date.now() - parsed.timestamp < parsed.expiresIn) {
          setCache(parsed);
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const updateCache = (data: StationCache) => {
    const entry: CacheEntry<StationCache> = {
      data,
      timestamp: Date.now(),
      expiresIn: CACHE_DURATION
    };
    
    setCache(entry);
    
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  };

  const clearCache = () => {
    setCache(null);
    localStorage.removeItem(CACHE_KEY);
  };

  const isValid = useMemo(() => {
    if (!cache) return false;
    return Date.now() - cache.timestamp < cache.expiresIn;
  }, [cache]);

  return {
    cache: isValid ? cache?.data : null,
    updateCache,
    clearCache,
    isValid
  };
}
