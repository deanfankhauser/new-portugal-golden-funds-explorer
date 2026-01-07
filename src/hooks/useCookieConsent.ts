import { useState, useEffect } from 'react';

export const useCookieConsentStatus = () => {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem('cookie-consent') === 'true';
  });

  useEffect(() => {
    const handleConsentUpdate = () => {
      setHasConsented(localStorage.getItem('cookie-consent') === 'true');
    };
    
    window.addEventListener('cookieConsentUpdated', handleConsentUpdate);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate);
  }, []);

  return hasConsented;
};
