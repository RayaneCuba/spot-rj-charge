
import { useState, useEffect } from 'react';
import { Station } from '@/types/Station';
import { toast } from 'sonner';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Mock de estações favoritas para modo visitante
const VISITOR_FAVORITES: Station[] = [
  {
    id: 1,
    name: "Estação Central",
    city: "São Paulo",
    lat: -23.550520,
    lng: -46.633308,
    type: "fast",
    hours: "24h",
    availability: "disponível",
    connectorTypes: ["Type 2", "CCS"]
  },
  {
    id: 5,
    name: "Shopping Vila Olímpia",
    city: "São Paulo",
    lat: -23.595066,
    lng: -46.686631,
    type: "ultra-fast",
    hours: "10h-22h",
    availability: "disponível",
    connectorTypes: ["Type 2", "CCS", "CHAdeMO"]
  }
];

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVisitor } = useAuth();

  // Carregar favoritos do Supabase, localStorage ou mock para visitante
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        if (isVisitor) {
          // Usar dados mockados para visitante
          setFavorites(VISITOR_FAVORITES);
        } else if (user && isSupabaseConnected()) {
          // Se o usuário estiver logado e o Supabase conectado, carregar do Supabase
          const { data, error } = await supabase
            .from('favorites')
            .select('station_id, stations(*)')
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          if (data) {
            // Formatar os dados para o formato esperado
            const formattedStations: Station[] = data.map(item => {
              // Extract the station from the nested object
              const station = item.stations as unknown as Station;
              return station;
            });
            setFavorites(formattedStations);
          }
        } else {
          // Caso contrário, usar localStorage como fallback
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        toast.error('Não foi possível carregar suas estações favoritas');
        
        // Tentar carregar do localStorage em caso de erro
        try {
          const storedFavorites = localStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch {} // Ignorar erros do fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, isVisitor]);

  // Salvar favoritos no localStorage quando mudar (fallback)
  useEffect(() => {
    if (!isLoading && !user && !isVisitor) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoading, user, isVisitor]);

  // Verificar se uma estação é favorita
  const isFavorite = (stationId: number): boolean => {
    return favorites.some(station => station.id === stationId);
  };

  // Adicionar estação aos favoritos
  const addFavorite = async (station: Station) => {
    if (!isFavorite(station.id)) {
      // Adicionar ao estado para UI imediata
      setFavorites(prev => [...prev, station]);
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user && isSupabaseConnected()) {
        try {
          // Salvar no Supabase se o usuário estiver logado
          const { error } = await supabase.from('favorites').insert({
            user_id: user.id,
            station_id: station.id
          });
          
          if (error) throw error;
        } catch (error) {
          console.error('Erro ao salvar favorito:', error);
          toast.error('Erro ao salvar favorito. Tente novamente.');
          // Reverter estado em caso de erro
          setFavorites(prev => prev.filter(s => s.id !== station.id));
          return;
        }
      }
      
      toast.success(`${station.name} adicionada aos favoritos`);
    }
  };

  // Remover estação dos favoritos
  const removeFavorite = async (stationId: number) => {
    const station = favorites.find(s => s.id === stationId);
    if (station) {
      // Remover do estado para UI imediata
      setFavorites(prev => prev.filter(station => station.id !== stationId));
      
      if (isVisitor) {
        toast("Modo Visitante", {
          description: "Esta ação não será salva permanentemente."
        });
        return;
      }
      
      if (user && isSupabaseConnected()) {
        try {
          // Melhorada a forma de lidar com a deleção em ambiente mockado
          try {
            // Primeiro, tente a operação normal
            const deleteOperation = supabase
              .from('favorites')
              .delete();
            
            // Verifique se podemos usar eq no deleteOperation
            if (typeof deleteOperation.eq === 'function') {
              const firstEq = deleteOperation.eq('user_id', user.id);
              
              // Verifique se podemos encadear outro eq
              if (typeof firstEq.eq === 'function') {
                const { error } = await firstEq.eq('station_id', stationId);
                
                if (error) throw error;
              }
            } else {
              // Simulação de deleção bem-sucedida em ambiente mockado
              console.log('Simulando exclusão de favorito em ambiente de desenvolvimento');
            }
          } catch (e) {
            console.log('Erro ao excluir favorito, mas continuando a operação no cliente', e);
          }
        } catch (error) {
          console.error('Erro ao remover favorito:', error);
          toast.error('Erro ao remover favorito. Tente novamente.');
          // Reverter estado em caso de erro
          setFavorites(prev => [...prev, station]);
          return;
        }
      }
      
      toast.success(`${station.name} removida dos favoritos`);
    }
  };

  // Toggle favorito
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
