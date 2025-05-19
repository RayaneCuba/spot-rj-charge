
interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-96 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-center p-6">
        <p className="text-red-500 font-semibold text-lg mb-2">Erro ao carregar o mapa</p>
        <p className="text-sm text-muted-foreground mb-4">
          Não foi possível carregar os dados das estações de carregamento.
        </p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
