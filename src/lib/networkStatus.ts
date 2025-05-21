
import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  lastOnlineTimestamp: number | null;
}

// Store para gerenciar o status da rede
export const useNetworkStatus = create<NetworkState>((set) => ({
  isOnline: navigator.onLine,
  lastOnlineTimestamp: navigator.onLine ? Date.now() : null,
  setIsOnline: (status: boolean) => set({ 
    isOnline: status,
    lastOnlineTimestamp: status ? Date.now() : null
  }),
}));

// Configurar listeners de eventos para monitorar conectividade
export const setupNetworkListeners = () => {
  const { setIsOnline } = useNetworkStatus.getState();
  
  // Listener para quando a conexão cair
  window.addEventListener('offline', () => {
    console.log('Conexão perdida - modo offline ativado');
    setIsOnline(false);
  });

  // Listener para quando a conexão retornar
  window.addEventListener('online', () => {
    console.log('Conexão restaurada - modo online ativado');
    setIsOnline(true);
  });

  return () => {
    window.removeEventListener('offline', () => setIsOnline(false));
    window.removeEventListener('online', () => setIsOnline(true));
  };
};

// Verificar se a conexão está ativa através de uma solicitação de rede real
export const checkActualConnectivity = async (): Promise<boolean> => {
  try {
    // Solicitar um recurso pequeno com timestamp para evitar cache
    const response = await fetch(`https://httpbin.org/status/200?timestamp=${Date.now()}`, { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    return response.ok;
  } catch (error) {
    console.log('Verificação de conectividade falhou:', error);
    return false;
  }
};
