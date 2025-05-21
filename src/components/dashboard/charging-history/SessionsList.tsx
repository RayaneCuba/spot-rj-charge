
import { SessionItem } from "./SessionItem";
import { EmptyState } from "./EmptyState";

interface SessionsListProps {
  sessions: Array<{
    id: number;
    stationName: string;
    date: string;
    status: string;
    duration: number;
    energy: number;
    cost: number;
  }>;
}

export function SessionsList({ sessions }: SessionsListProps) {
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
