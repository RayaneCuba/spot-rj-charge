
// Types for performance monitoring system

// Interface for events of performance
export interface PerformanceEvent {
  eventName: string;
  duration: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Interface for error data
export interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

// Configuration options for monitoring
export interface MonitoringConfig {
  // Threshold to consider an operation slow (in ms)
  slowThreshold: number;
  // Whether to collect detailed user data
  collectUserData: boolean;
  // Buffer size before sending
  bufferSize: number;
  // Endpoint for sending (configured in production)
  endpoint: string | null;
}
