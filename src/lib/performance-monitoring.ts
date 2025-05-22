
import { toast } from 'sonner';
import env from '@/config/environment';
import React, { useEffect } from 'react';

// Interface para eventos de performance
interface PerformanceEvent {
  eventName: string;
  duration: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Interface para dados de erro
interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Configurações de monitoramento
const config = {
  // Limite para considerar uma operação lenta (em ms)
  slowThreshold: 1000,
  // Se deve coletar dados detalhados do usuário
  collectUserData: false,
  // Buffer de eventos antes de enviar
  bufferSize: 10,
  // Endpoint para envio (seria configurado em produção)
  endpoint: env.name === 'production' 
    ? 'https://api.electrospot.app/monitoring' 
    : null
};

// Buffers para armazenar eventos antes de enviar
const performanceBuffer: PerformanceEvent[] = [];
const errorBuffer: ErrorEvent[] = [];

// Função para medir o tempo de uma operação
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
    
    // Registrar evento de performance
    trackPerformance(operationName, duration, metadata);
  }
}

// Versão assíncrona do measurePerformance
export async function measurePerformanceAsync<T>(
  operationName: string, 
  operation: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    // Registrar evento de performance
    trackPerformance(operationName, duration, metadata);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Registrar evento de performance mesmo em caso de erro
    trackPerformance(operationName, duration, {
      ...metadata,
      error: true,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    
    throw error;
  }
}

// Função para rastrear um evento de performance
export function trackPerformance(
  eventName: string, 
  duration: number,
  metadata?: Record<string, any>
) {
  console.debug(`Performance [${eventName}]: ${duration.toFixed(2)}ms`);
  
  // Avisar no console sobre operações lentas
  if (duration > config.slowThreshold) {
    console.warn(`Operação lenta detectada [${eventName}]: ${duration.toFixed(2)}ms`);
    
    // Em desenvolvimento, mostrar toasts para operações lentas
    if (env.name === 'development') {
      toast.warning(`Operação lenta: ${eventName}`, {
        description: `Duração: ${duration.toFixed(2)}ms`,
      });
    }
  }
  
  // Adicionar ao buffer
  performanceBuffer.push({
    eventName,
    duration,
    metadata,
    timestamp: Date.now()
  });
  
  // Enviar dados se buffer estiver cheio
  if (performanceBuffer.length >= config.bufferSize) {
    flushPerformanceBuffer();
  }
}

// Registrar um erro para monitoramento
export function trackError(
  error: Error | string,
  componentStack?: string,
  metadata?: Record<string, any>
) {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  console.error('Erro capturado:', errorMessage, errorStack);
  
  // Adicionar ao buffer
  errorBuffer.push({
    message: errorMessage,
    stack: errorStack,
    componentStack,
    metadata,
    timestamp: Date.now()
  });
  
  // Enviar dados se buffer estiver cheio
  if (errorBuffer.length >= config.bufferSize) {
    flushErrorBuffer();
  }
}

// Enviar buffer de performance
async function flushPerformanceBuffer() {
  if (!config.endpoint || performanceBuffer.length === 0) return;
  
  const eventsToSend = [...performanceBuffer];
  performanceBuffer.length = 0;
  
  try {
    // Tentativa de enviar dados para o backend
    await fetch(`${config.endpoint}/performance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: eventsToSend,
        metadata: getMetadata()
      }),
      // Usar keepalive para garantir que a solicitação não seja cancelada
      keepalive: true
    });
  } catch (error) {
    console.error('Erro ao enviar dados de performance:', error);
  }
}

// Enviar buffer de erros
async function flushErrorBuffer() {
  if (!config.endpoint || errorBuffer.length === 0) return;
  
  const errorsToSend = [...errorBuffer];
  errorBuffer.length = 0;
  
  try {
    // Tentativa de enviar dados para o backend
    await fetch(`${config.endpoint}/errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errors: errorsToSend,
        metadata: getMetadata()
      }),
      // Usar keepalive para garantir que a solicitação não seja cancelada
      keepalive: true
    });
  } catch (error) {
    console.error('Erro ao enviar dados de erros:', error);
  }
}

// Obter metadados gerais para qualquer relatório
function getMetadata() {
  return {
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    // Métricas de performance do navegador
    navigation: performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : null,
    memory: 'memory' in performance 
      ? (performance as any).memory
      : null
  };
}

// Inicializar monitoramento de erros não capturados
export function initializeErrorMonitoring() {
  // Capturar erros não tratados
  window.addEventListener('error', (event) => {
    trackError(event.error || event.message, undefined, {
      lineNumber: event.lineno,
      columnNumber: event.colno,
      filename: event.filename
    });
  });
  
  // Capturar rejeições de promessas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));
    
    trackError(error, undefined, {
      type: 'unhandledRejection'
    });
  });
  
  // Enviar dados pendentes quando a página for fechada
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

// Observador de performance do React
export function withPerformanceTracking<P>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> {
  return function WrappedComponent(props: P) {
    const startTime = performance.now();
    
    useEffect(() => {
      const renderTime = performance.now() - startTime;
      trackPerformance(`render.${componentName}`, renderTime);
      
      return () => {
        const mountDuration = performance.now() - startTime;
        trackPerformance(`mount.${componentName}`, mountDuration);
      };
    }, []);
    
    return React.createElement(Component, props);
  };
}
