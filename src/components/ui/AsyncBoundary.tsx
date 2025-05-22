
import { Suspense, ErrorBoundary as ReactErrorBoundary } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { trackError } from '@/lib/performance-monitoring';
import { cn } from '@/lib/utils';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: FallbackProps) => (
  <div className="rounded-md border border-red-200 p-6 shadow-sm bg-red-50 dark:bg-red-950/10 dark:border-red-900/20">
    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
      </div>
      <div className="mt-4 sm:ml-6 sm:mt-0">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
          Erro ao carregar
        </h3>
        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
          <p>
            {error.message || 'Ocorreu um erro ao carregar este componente.'}
          </p>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={resetError}
            className="inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  </div>
);

const LoadingFallback = ({ 
  message = "Carregando...", 
  size = "default"
}: { 
  message?: string 
  size?: "small" | "default" | "large"
}) => (
  <div className={cn(
    "flex justify-center items-center",
    size === "small" && "h-24",
    size === "default" && "h-48",
    size === "large" && "h-96",
  )}>
    <div className="flex flex-col items-center space-y-2 text-center">
      <Loader2 className={cn(
        "animate-spin text-primary",
        size === "small" && "h-6 w-6",
        size === "default" && "h-8 w-8",
        size === "large" && "h-10 w-10",
      )} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

interface AsyncBoundaryProps {
  children: React.ReactNode;
  loadingMessage?: string;
  loadingSize?: "small" | "default" | "large";
  onError?: (error: Error) => void;
}

export function AsyncBoundary({ 
  children, 
  loadingMessage, 
  loadingSize = "default", 
  onError 
}: AsyncBoundaryProps) {
  const handleError = (error: Error) => {
    // Reportar erro ao sistema de monitoramento
    trackError(error, "AsyncBoundary");
    
    // Passar para handler personalizado se fornecido
    if (onError) {
      onError(error);
    }
  };

  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetError={resetErrorBoundary} />
      )}
      onError={handleError}
    >
      <Suspense fallback={<LoadingFallback message={loadingMessage} size={loadingSize} />}>
        {children}
      </Suspense>
    </ReactErrorBoundary>
  );
}
