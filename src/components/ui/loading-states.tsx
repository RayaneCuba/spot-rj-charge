
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Skeleton } from './skeleton';

// Available sizes for LoadingSpinner
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <Loader className={cn("animate-spin text-primary", sizeClasses[size], className)} />
  );
}

// Interface for LoadingState component
interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
  size?: 'compact' | 'default' | 'full';
}

export function LoadingState({ 
  title = "Carregando dados", 
  description,
  className,
  size = 'default'
}: LoadingStateProps) {
  if (size === 'compact') {
    return (
      <div className={cn("flex items-center gap-2 py-2", className)}>
        <LoadingSpinner size="sm" />
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
    );
  }
  
  const heightClass = size === 'full' ? 'h-[70vh]' : 'h-40';
  
  return (
    <div className={cn(`flex flex-col items-center justify-center ${heightClass}`, className)}>
      <LoadingSpinner size="lg" />
      <h3 className="mt-4 font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

// Interface for ErrorState component
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados solicitados.",
  onRetry,
  className,
  variant = 'default'
}: ErrorStateProps) {
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2 py-2 text-destructive", className)}>
        <span className="text-sm">{title}</span>
        {onRetry && (
          <Button variant="link" size="sm" className="p-0 h-auto" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </div>
    );
  }
  
  if (variant === 'inline') {
    return (
      <Alert variant="destructive" className={cn("my-2", className)}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            Tentar novamente
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 rounded-md", className)}>
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
        <svg
          className="h-6 w-6 text-red-600 dark:text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 dark:text-red-300">{title}</h3>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ 
  message = "Nenhum dado encontrado", 
  className 
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center py-6 text-muted-foreground", className)}>
      <p>{message}</p>
    </div>
  );
}

// Collection of skeleton loaders for different components
export function TableSkeleton({ rows = 3, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <div className="flex gap-4 mb-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
