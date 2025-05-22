
// Utility functions for performance monitoring

// Get metadata for any report
export function getMetadata(): Record<string, any> {
  return {
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    // Browser performance metrics
    navigation: performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : null,
    memory: 'memory' in performance 
      ? (performance as any).memory
      : null
  };
}
