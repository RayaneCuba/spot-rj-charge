
import { setupNetworkListeners } from './networkStatus';
import { initializeMonitoring } from './performance-monitoring';

export function initializeApp() {
  // Configure listeners to monitor network status
  setupNetworkListeners();
  
  // Initialize performance monitoring
  initializeMonitoring();
  
  console.log('🚀 ElectroSpot inicializado com sistema de sincronização offline/online');
}
