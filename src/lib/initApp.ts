
import { setupNetworkListeners } from './networkStatus';

export function initializeApp() {
  // Configurar listeners para monitorar status da rede
  setupNetworkListeners();
  
  console.log('🚀 ElectroSpot inicializado com sistema de sincronização offline/online');
}
