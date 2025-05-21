
import { SessionItem } from "./SessionItem";
import { EmptyState } from "./EmptyState";
import { ErrorState, LoadingState } from "@/components/ui/loading-states";

interface Session {
  id: number;
  stationName: string;
  date: string;
  status: string;
  duration: number;
  energy: number;
  cost: number;
}

interface SessionsListProps {
  sessions: Session[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function SessionsList({ sessions, isLoading, error, onRetry }: SessionsListProps) {
  if (isLoading) {
    return <LoadingState size="compact" title="Carregando histórico" />;
  }

  if (error) {
    return (
      <ErrorState 
        variant="inline" 
        title="Erro ao carregar histórico" 
        description={error.message}
        onRetry={onRetry}
      />
    );
  }

  if (sessions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {sessions.map(session => (
        <SessionItem key={session.id} session={session} />
      ))}
    </div>
  );
}
