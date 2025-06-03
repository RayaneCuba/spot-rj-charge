
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, setIsOnline };
}

export async function checkActualConnectivity(): Promise<boolean> {
  try {
    // Try to fetch a small resource to verify actual connectivity
    const response = await fetch('/favicon.ico', {
      method: 'HEAD',
      cache: 'no-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function setupNetworkListeners() {
  console.log('Network status listeners configured');
  
  // Additional network monitoring setup can be added here
  window.addEventListener('online', () => {
    console.log('🌐 Network: Online');
  });
  
  window.addEventListener('offline', () => {
    console.log('🌐 Network: Offline');
  });
}
