'use client';

import ErrorPage from '@/components/error-page';
import { useEffect } from 'react';

export default function ErrorRoute() {
  // Log that user was redirected to error page
  useEffect(() => {
    console.error('[Error Route] User redirected to error page:', {
      timestamp: new Date().toISOString(),
      referrer: typeof window !== 'undefined' ? document.referrer : 'N/A',
    });
    
    // Clear the redirect flag after a short delay to allow retry
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        sessionStorage.removeItem('error_redirected');
      }, 5000); // Clear after 5 seconds
    }
  }, []);

  return <ErrorPage />;
}

