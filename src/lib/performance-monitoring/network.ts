import { config } from './config';
import { performanceBuffer, errorBuffer } from './buffers';
import { getMetadata } from './utils';

// Send performance buffer
export async function flushPerformanceBuffer(): Promise<void> {
  if (!config.endpoint || performanceBuffer.length === 0) return;
  
  const eventsToSend = [...performanceBuffer];
  performanceBuffer.length = 0;
  
  try {
    // Try to send data to backend
    await fetch(`${config.endpoint}/performance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events: eventsToSend,
        metadata: getMetadata()
      }),
      // Use keepalive to ensure request is not canceled
      keepalive: true
    });
  } catch (error) {
    console.error('Erro ao enviar dados de performance:', error);
  }
}

// Send error buffer
export async function flushErrorBuffer(): Promise<void> {
  if (!config.endpoint || errorBuffer.length === 0) return;
  
  const errorsToSend = [...errorBuffer];
  errorBuffer.length = 0;
  
  try {
    // Try to send data to backend
    await fetch(`${config.endpoint}/errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errors: errorsToSend,
        metadata: getMetadata()
      }),
      // Use keepalive to ensure request is not canceled
      keepalive: true
    });
  } catch (error) {
    console.error('Erro ao enviar dados de erros:', error);
  }
}
