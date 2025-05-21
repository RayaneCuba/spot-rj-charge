
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle, X } from 'lucide-react';

export type ErrorSeverity = 'critical' | 'warning' | 'info';

interface ErrorContextType {
  // For critical errors that need a modal
  reportCriticalError: (title: string, description: string, onAcknowledge?: () => void) => void;
  // For warning errors that need an alert
  reportWarning: (title: string, description: string) => string;
  // For dismissable warnings
  dismissWarning: (id: string) => void;
  // For info errors that need a toast
  reportInfo: (message: string) => void;
  // For network errors
  reportNetworkError: (retryFn?: () => void) => void;
}

const ErrorContext = createContext<ErrorContextType | null>(null);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [criticalError, setCriticalError] = useState<{
    title: string;
    description: string;
    onAcknowledge?: () => void;
    isOpen: boolean;
  }>({
    title: '',
    description: '',
    isOpen: false
  });

  const [warnings, setWarnings] = useState<{
    id: string;
    title: string;
    description: string;
  }[]>([]);

  const reportCriticalError = useCallback((title: string, description: string, onAcknowledge?: () => void) => {
    setCriticalError({
      title,
      description,
      onAcknowledge,
      isOpen: true
    });
  }, []);

  const reportWarning = useCallback((title: string, description: string) => {
    const id = Date.now().toString();
    setWarnings(prev => [...prev, { id, title, description }]);
    return id;
  }, []);

  const dismissWarning = useCallback((id: string) => {
    setWarnings(prev => prev.filter(warning => warning.id !== id));
  }, []);

  const reportInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  const reportNetworkError = useCallback((retryFn?: () => void) => {
    toast.error('Falha na conexão com a rede', {
      description: "Verifique sua conexão com a internet",
      action: retryFn ? {
        label: "Tentar novamente",
        onClick: retryFn,
      } : undefined,
      duration: 5000,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    if (criticalError.onAcknowledge) {
      criticalError.onAcknowledge();
    }
    setCriticalError(prev => ({ ...prev, isOpen: false }));
  }, [criticalError]);

  return (
    <ErrorContext.Provider
      value={{
        reportCriticalError,
        reportWarning,
        dismissWarning,
        reportInfo,
        reportNetworkError
      }}
    >
      {/* Critical Error Modal */}
      <AlertDialog open={criticalError.isOpen} onOpenChange={(open) => {
        if (!open) handleCloseModal();
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{criticalError.title}</AlertDialogTitle>
            <AlertDialogDescription>{criticalError.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseModal}>Entendi</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Display active warnings */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-80">
        {warnings.map(warning => (
          <Alert key={warning.id} variant="default" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">{warning.title}</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              {warning.description}
            </AlertDescription>
            <button 
              onClick={() => dismissWarning(warning.id)}
              className="absolute top-1 right-1 p-1 rounded-full text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/50"
            >
              <X className="h-4 w-4" />
            </button>
          </Alert>
        ))}
      </div>

      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError deve ser usado dentro de um ErrorProvider");
  }
  return context;
}
