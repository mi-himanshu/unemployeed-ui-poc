'use client';

import ErrorPage from '@/components/error-page';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log all error details for debugging - never shown to users
  useEffect(() => {
    console.error('[Error Boundary] Error caught:', {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      name: error?.name,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return <ErrorPage />;
}

