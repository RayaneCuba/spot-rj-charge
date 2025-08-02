import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Clock, Battery } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useReservations } from "@/hooks/useReservations";
import { chargingStations, connectorTypes } from "@/data/stations";

const reservationSchema = z.object({
  station_id: z.string().min(1, "Selecione uma estação"),
  reserved_date: z.date({
    required_error: "Selecione uma data",
  }),
  reserved_time: z.string().min(1, "Selecione um horário"),
  duration_hours: z.string().min(1, "Selecione a duração"),
  connector_type: z.string().min(1, "Selecione o tipo de conector"),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  open: boolean;
  onClose: () => void;
}

export function ReservationForm({ open, onClose }: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReservation } = useReservations();
  const allStations = chargingStations;

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      station_id: "",
      reserved_time: "",
      duration_hours: "",
      connector_type: "",
    },
  });

  const selectedStation = allStations.find(
    station => station.id.toString() === form.watch("station_id")
  );

  const availableTimes = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
    "22:00"
  ];

  const durations = [
    { value: "0.5", label: "30 minutos" },
    { value: "1", label: "1 hora" },
    { value: "1.5", label: "1h 30min" },
    { value: "2", label: "2 horas" },
    { value: "3", label: "3 horas" },
    { value: "4", label: "4 horas" },
  ];

  async function onSubmit(data: ReservationFormData) {
    setIsSubmitting(true);
    try {
      await createReservation({
        station_id: parseInt(data.station_id),
        reserved_date: data.reserved_date.toISOString().split('T')[0],
        reserved_time: data.reserved_time,
        duration_hours: parseFloat(data.duration_hours),
        connector_type: data.connector_type,
      });
      
      toast.success("Reserva criada com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      toast.error("Erro ao criar reserva. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Reserva</DialogTitle>
          <DialogDescription>
            Agende seu carregamento em uma de nossas estações
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Seleção de Estação */}
            <FormField
              control={form.control}
              name="station_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Estação de Carregamento
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma estação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allStations.map((station) => (
                        <SelectItem key={station.id} value={station.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{station.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {station.city}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="reserved_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Reserva</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Horário */}
            <FormField
              control={form.control}
              name="reserved_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horário
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duração */}
            <FormField
              control={form.control}
              name="duration_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração do Carregamento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Conector */}
            <FormField
              control={form.control}
              name="connector_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Battery className="h-4 w-4" />
                    Tipo de Conector
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o conector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {connectorTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-electric-green hover:bg-electric-green/90"
              >
                {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}