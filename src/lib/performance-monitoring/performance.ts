
import { toast } from 'sonner';
import env from '@/config/environment';
import { PerformanceEvent } from './types';
import { config } from './config';
import { performanceBuffer } from './buffers';
import { flushPerformanceBuffer } from './network';

// Function to track a performance event
export function trackPerformance(
  eventName: string, 
  duration: number,
  metadata?: Record<string, any>
): void {
  console.debug(`Performance [${eventName}]: ${duration.toFixed(2)}ms`);
  
  // Warn about slow operations
  if (duration > config.slowThreshold) {
    console.warn(`Operação lenta detectada [${eventName}]: ${duration.toFixed(2)}ms`);
    
    // In development, show toasts for slow operations
    if (env.name === 'development') {
      toast.warning(`Operação lenta: ${eventName}`, {
        description: `Duração: ${duration.toFixed(2)}ms`,
      });
    }
  }
  
  // Add to buffer
  performanceBuffer.push({
    eventName,
    duration,
    metadata,
    timestamp: Date.now()
  });
  
  // Send data if buffer is full
  if (performanceBuffer.length >= config.bufferSize) {
    flushPerformanceBuffer();
  }
}

// Function to measure the time of an operation
export function measurePerformance<T>(
  operationName: string, 
  operation: () => T,
  metadata?: Record<string, any>
): T {
  const startTime = performance.now();
  let result: T;
  
  try {
    result = operation();
    return result;
  } finally {
    const duration = performance.now() - startTime;
    
    // Record performance event
    trackPerformance(operationName, duration, metadata);
  }
}

// Async version of measurePerformance
export async function measurePerformanceAsync<T>(
  operationName: string, 
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    // Record performance event
    trackPerformance(operationName, duration, metadata);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Record performance event even in case of error
    trackPerformance(operationName, duration, {
      ...metadata,
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    throw error;
  }
}
