
import { EmptyState as BaseEmptyState } from '@/components/ui/loading-states';

export function EmptyState() {
  return (
    <BaseEmptyState message="Nenhum carregamento registrado." />
  );
}
