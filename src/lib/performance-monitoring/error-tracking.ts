
import { ErrorEvent } from './types';
import { errorBuffer } from './buffers';
import { flushErrorBuffer } from './network';

// Register an error for monitoring
export function trackError(
  error: Error | string,
  componentStack?: string,
  metadata?: Record<string, any>
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error('Erro capturado:', errorMessage, errorStack);
  
  // Add to buffer
  errorBuffer.push({
    message: errorMessage,
    stack: errorStack,
    componentStack,
    metadata,
    timestamp: Date.now()
  });
  
  // Send data if buffer is full
  if (errorBuffer.length >= config.bufferSize) {
    flushErrorBuffer();
  }
}

// Initialize error monitoring
export function initializeErrorMonitoring(): void {
  // Capture unhandled errors
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, undefined, {
      lineNumber: event.lineno,
      columnNumber: event.colno,
      filename: event.filename
    });
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    trackError(error, undefined, {
      type: 'unhandledRejection'
    });
  });
  
  // Send pending data when page is closed
  window.addEventListener('beforeunload', () => {
    if (performanceBuffer.length > 0) {
      navigator.sendBeacon(
        `${config.endpoint}/performance`,
        JSON.stringify({
          events: performanceBuffer,
          metadata: getMetadata()
        })
      );
    }
    
    if (errorBuffer.length > 0) {
      navigator.sendBeacon(
        `${config.endpoint}/errors`,
        JSON.stringify({
          errors: errorBuffer,
          metadata: getMetadata()
        })
      );
    }
  });
  
  console.info('Monitoramento de erros e performance inicializado');
}

import { config } from './config';
import { performanceBuffer } from './buffers';
import { getMetadata } from './utils';
