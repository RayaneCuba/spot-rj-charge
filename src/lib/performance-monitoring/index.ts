
// Main entry point for performance monitoring system

// Re-export all functionality for backwards compatibility
export * from './types';
export * from './performance';
export * from './error-tracking';
export * from './react';

import { initializeErrorMonitoring } from './error-tracking';

// Initialize monitoring system
export function initializeMonitoring(): void {
  initializeErrorMonitoring();
}
