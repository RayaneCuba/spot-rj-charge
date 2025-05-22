
import env from '@/config/environment';
import { MonitoringConfig } from './types';

// Configuration for performance monitoring
export const config: MonitoringConfig = {
  // Threshold to consider an operation slow (in ms)
  slowThreshold: 1000,
  // Whether to collect detailed user data
  collectUserData: false,
  // Buffer size before sending
  bufferSize: 10,
  // Endpoint for sending (configured in production)
  endpoint: env.name === 'production' 
    ? 'https://api.electrospot.app/monitoring' 
    : null
};
