
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useNetworkStatus, checkActualConnectivity } from '@/lib/networkStatus';

// Define types for the hook
interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  showToastOnError?: boolean;
  errorMessage?: string;
}

interface UseAsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  retryCount: number;
}

export function useAsync<T = any>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {},
  dependencies: any[] = []
) {
  const {
    onSuccess,
    onError,
    autoRetry = true,
    maxRetries = 3,
    retryDelay = 2000,
    showToastOnError = true,
    errorMessage = "Ocorreu um erro na operação"
  } = options;

  const { isOnline, setIsOnline } = useNetworkStatus();
  
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    retryCount: 0
  });

  // Reset state when dependencies change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      retryCount: 0
    }));
  }, dependencies);

  // Execute the async function
  const execute = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      isSuccess: false
    }));

    try {
      // Check if we're actually online before proceeding
      if (autoRetry) {
        const actuallyOnline = await checkActualConnectivity();
        if (!actuallyOnline) {
          setIsOnline(false);
          throw new Error("Sem conexão com a internet");
        }
      }

      const result = await asyncFunction();
      setState({
        data: result,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false,
        retryCount: 0
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorObject = error instanceof Error ? error : new Error(String(error));
      
      setState(prev => ({
        ...prev,
        error: errorObject,
        isLoading: false,
        isSuccess: false,
        isError: true
      }));
      
      if (onError) {
        onError(errorObject);
      }

      // Show error toast if configured
      if (showToastOnError) {
        toast.error(errorMessage || errorObject.message);
      }

      // Handle auto-retry if enabled and we haven't exceeded max retries
      if (autoRetry && state.retryCount < maxRetries && isOnline) {
        setState(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1
        }));
        
        setTimeout(() => {
          execute();
        }, retryDelay);
      }
      
      throw errorObject;
    }
  }, [asyncFunction, isOnline, state.retryCount, ...dependencies]);

  // Run effect if dependencies change and we haven't started yet
  useEffect(() => {
    execute();
  }, [execute]);

  // Return state and manual retry function
  return {
    ...state,
    execute,
    retry: execute,
  };
}
