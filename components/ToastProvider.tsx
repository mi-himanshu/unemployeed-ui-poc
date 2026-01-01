'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#1a1a1a',
          color: '#f6f6f6',
          border: '1px solid rgba(246, 246, 246, 0.2)',
          borderRadius: '8px',
          padding: '16px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#f6f6f6',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#f6f6f6',
          },
        },
      }}
    />
  );
}

