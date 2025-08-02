import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export interface Reservation {
  id: number;
  user_id: string;
  station_id: number;
  station_name: string;
  station_address: string;
  reserved_date: string;
  reserved_time: string;
  duration_hours: number;
  connector_type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateReservationData {
  station_id: number;
  reserved_date: string;
  reserved_time: string;
  duration_hours: number;
  connector_type: string;
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isVisitor } = useAuth();

  useEffect(() => {
    if (user && !isVisitor) {
      fetchReservations();
    } else {
      // Para visitantes, usar dados mock do localStorage
      loadMockReservations();
    }
  }, [user, isVisitor]);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          stations (
            name,
            address
          )
        `)
        .eq('user_id', user?.id)
        .order('reserved_date', { ascending: true });

      if (error) throw error;

      const formattedReservations = data?.map(reservation => ({
        ...reservation,
        station_name: reservation.stations?.name || 'Estação desconhecida',
        station_address: reservation.stations?.address || 'Endereço não disponível',
      })) || [];

      setReservations(formattedReservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      // Fallback para dados mock em caso de erro
      loadMockReservations();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockReservations = () => {
    setIsLoading(true);
    // Simular carregamento
    setTimeout(() => {
      const mockReservations = JSON.parse(
        localStorage.getItem('mock_reservations') || '[]'
      );
      setReservations(mockReservations);
      setIsLoading(false);
    }, 500);
  };

  const createReservation = async (data: CreateReservationData) => {
    if (isVisitor) {
      // Para visitantes, salvar no localStorage
      const newReservation: Reservation = {
        id: Date.now(),
        user_id: 'visitor',
        station_id: data.station_id,
        station_name: `Estação ${data.station_id}`,
        station_address: 'Endereço da estação',
        reserved_date: data.reserved_date,
        reserved_time: data.reserved_time,
        duration_hours: data.duration_hours,
        connector_type: data.connector_type,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const existingReservations = JSON.parse(
        localStorage.getItem('mock_reservations') || '[]'
      );
      const updatedReservations = [...existingReservations, newReservation];
      localStorage.setItem('mock_reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      return newReservation;
    }

    // Para usuários autenticados, usar Supabase - simulação
    const reservation = {
      id: Date.now(),
      user_id: user?.id || '',
      station_id: data.station_id,
      station_name: `Estação ${data.station_id}`,
      station_address: 'Endereço da estação',
      reserved_date: data.reserved_date,
      reserved_time: data.reserved_time,
      duration_hours: data.duration_hours,
      connector_type: data.connector_type,
      status: 'confirmed' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stations: {
        name: `Estação ${data.station_id}`,
        address: 'Endereço da estação'
      }
    };
    const error = null;

    if (error) throw error;

    const formattedReservation = {
      ...reservation,
      station_name: reservation.stations?.name || 'Estação desconhecida',
      station_address: reservation.stations?.address || 'Endereço não disponível',
    };

    setReservations(prev => [...prev, formattedReservation]);
    return formattedReservation;
  };

  const updateReservationStatus = async (id: number, status: Reservation['status']) => {
    if (isVisitor) {
      // Para visitantes, atualizar localStorage
      const existingReservations = JSON.parse(
        localStorage.getItem('mock_reservations') || '[]'
      );
      const updatedReservations = existingReservations.map((res: Reservation) =>
        res.id === id ? { ...res, status, updated_at: new Date().toISOString() } : res
      );
      localStorage.setItem('mock_reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      return;
    }

    // Para usuários autenticados, usar Supabase - simulação
    const error = null;

    if (error) throw error;

    setReservations(prev =>
      prev.map(res =>
        res.id === id ? { ...res, status, updated_at: new Date().toISOString() } : res
      )
    );
  };

  const deleteReservation = async (id: number) => {
    if (isVisitor) {
      // Para visitantes, remover do localStorage
      const existingReservations = JSON.parse(
        localStorage.getItem('mock_reservations') || '[]'
      );
      const updatedReservations = existingReservations.filter((res: Reservation) => res.id !== id);
      localStorage.setItem('mock_reservations', JSON.stringify(updatedReservations));
      setReservations(updatedReservations);
      return;
    }

    // Para usuários autenticados, usar Supabase - simulação
    const error = null;

    if (error) throw error;

    setReservations(prev => prev.filter(res => res.id !== id));
  };

  return {
    reservations,
    isLoading,
    createReservation,
    updateReservationStatus,
    deleteReservation,
    refreshReservations: user && !isVisitor ? fetchReservations : loadMockReservations,
  };
}