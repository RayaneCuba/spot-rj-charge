import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Battery, Plus } from "lucide-react";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { useReservations } from "@/hooks/useReservations";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Reservations() {
  const [showReservationForm, setShowReservationForm] = useState(false);
  const { reservations, isLoading } = useReservations();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Reservas</h1>
              <p className="text-muted-foreground">
                Gerencie suas reservas de carregamento e agende novos horários
              </p>
            </div>
            <Button 
              onClick={() => setShowReservationForm(true)}
              className="bg-electric-green hover:bg-electric-green/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </div>

          {/* Lista de Reservas */}
          <div className="space-y-4 mb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : reservations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não fez nenhuma reserva. Agende seu primeiro carregamento!
                  </p>
                  <Button 
                    onClick={() => setShowReservationForm(true)}
                    className="bg-electric-green hover:bg-electric-green/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Fazer Primeira Reserva
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {reservation.station_name}
                        </CardTitle>
                        <Badge 
                          variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'pending' ? 'secondary' :
                            reservation.status === 'completed' ? 'outline' : 'destructive'
                          }
                        >
                          {reservation.status === 'confirmed' && 'Confirmada'}
                          {reservation.status === 'pending' && 'Pendente'}
                          {reservation.status === 'completed' && 'Concluída'}
                          {reservation.status === 'cancelled' && 'Cancelada'}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {reservation.station_address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(reservation.reserved_date), "dd 'de' MMM", { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.reserved_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span>{reservation.connector_type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Duração:</span>
                          <span>{reservation.duration_hours}h</span>
                        </div>
                      </div>
                      
                      {reservation.status === 'confirmed' && (
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            Alterar Horário
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de Nova Reserva */}
      <ReservationForm
        open={showReservationForm}
        onClose={() => setShowReservationForm(false)}
      />
    </div>
  );
}