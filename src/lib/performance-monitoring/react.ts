
import React, { useEffect } from 'react';
import { trackPerformance } from './performance';

// React performance observer
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
