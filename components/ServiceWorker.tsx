'use client';

import { useEffect } from 'react';

export function ServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleLoad = () => {
        navigator.serviceWorker.register('/sw.js')
          .then(function(registration) {
            console.log('SW registered: ', registration);
          })
          .catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
          });
      };
      
      window.addEventListener('load', handleLoad);
      
      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', handleLoad);
        }
      };
    }
  }, []);

  return null;
}
