/**
 * Converts technical error messages to user-friendly messages
 * Technical details are logged to console for debugging
 */

export interface ErrorInfo {
  userMessage: string;
  actionMessage?: string; // What the user should do next
}

/**
 * Maps technical error messages to user-friendly messages
 */
export function getErrorMessage(error: any, context: 'login' | 'signup' | 'oauth' = 'login'): ErrorInfo {
  const errorMessage = error?.message || error?.detail || String(error) || 'An unexpected error occurred';
  const lowerMessage = errorMessage.toLowerCase();

  // Log technical details to console
  console.error(`[${context.toUpperCase()}] Technical error:`, {
    message: errorMessage,
    error: error,
    timestamp: new Date().toISOString(),
  });

  // Network/Connection errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('failed to fetch') ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ENOTFOUND'
  ) {
    return {
      userMessage: 'Unable to connect to our servers',
      actionMessage: 'Please check your internet connection and try again in a moment.',
    };
  }

  // Authentication errors - Login
  if (context === 'login') {
    if (
      lowerMessage.includes('invalid') ||
      lowerMessage.includes('incorrect') ||
      lowerMessage.includes('wrong password') ||
      lowerMessage.includes('invalid credentials') ||
      lowerMessage.includes('email or password')
    ) {
      return {
        userMessage: 'Invalid email or password',
        actionMessage: 'Please check your credentials and try again. If you forgot your password, use the "Forgot Password" link.',
      };
    }

    if (lowerMessage.includes('user not found') || lowerMessage.includes('does not exist')) {
      return {
        userMessage: 'Account not found',
        actionMessage: 'No account exists with this email. Please sign up to create a new account.',
      };
    }

    if (lowerMessage.includes('email not verified') || lowerMessage.includes('email verification')) {
      return {
        userMessage: 'Please verify your email first',
        actionMessage: 'Check your inbox for a verification email and click the link to verify your account.',
      };
    }

    if (lowerMessage.includes('too many requests') || lowerMessage.includes('rate limit')) {
      return {
        userMessage: 'Too many login attempts',
        actionMessage: 'Please wait a few minutes before trying again.',
      };
    }
  }

  // Authentication errors - Signup
  if (context === 'signup') {
    if (
      lowerMessage.includes('already exists') ||
      lowerMessage.includes('already registered') ||
      lowerMessage.includes('user already') ||
      lowerMessage.includes('email already')
    ) {
      return {
        userMessage: 'An account with this email already exists',
        actionMessage: 'Please log in instead, or use a different email address to create a new account.',
      };
    }

    if (
      lowerMessage.includes('password') &&
      (lowerMessage.includes('weak') || lowerMessage.includes('short') || lowerMessage.includes('minimum'))
    ) {
      return {
        userMessage: 'Password is too weak',
        actionMessage: 'Please use a password that is at least 6 characters long.',
      };
    }

    if (lowerMessage.includes('invalid email') || lowerMessage.includes('email format')) {
      return {
        userMessage: 'Invalid email address',
        actionMessage: 'Please enter a valid email address.',
      };
    }
  }

  // OAuth errors
  if (context === 'oauth') {
    if (lowerMessage.includes('cancelled') || lowerMessage.includes('denied')) {
      return {
        userMessage: 'Sign in was cancelled',
        actionMessage: 'You can try again or use email and password to sign in.',
      };
    }

    if (lowerMessage.includes('popup') || lowerMessage.includes('blocked')) {
      return {
        userMessage: 'Popup was blocked',
        actionMessage: 'Please allow popups for this site and try again.',
      };
    }
  }

  // Timeout errors
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      userMessage: 'Request timed out',
      actionMessage: 'The request took too long. Please try again.',
    };
  }

  // Server errors (500, 502, 503, etc.)
  if (
    lowerMessage.includes('internal server error') ||
    lowerMessage.includes('server error') ||
    lowerMessage.includes('500') ||
    lowerMessage.includes('502') ||
    lowerMessage.includes('503') ||
    error?.status >= 500
  ) {
    return {
      userMessage: 'Something went wrong on our end',
      actionMessage: 'We\'re working to fix this. Please try again in a few minutes.',
    };
  }

  // Bad request errors (400)
  if (lowerMessage.includes('bad request') || error?.status === 400) {
    return {
      userMessage: 'Invalid request',
      actionMessage: 'Please check your information and try again.',
    };
  }

  // Unauthorized errors (401)
  if (lowerMessage.includes('unauthorized') || error?.status === 401) {
    return {
      userMessage: 'Session expired',
      actionMessage: 'Please log in again to continue.',
    };
  }

  // Forbidden errors (403)
  if (lowerMessage.includes('forbidden') || error?.status === 403) {
    return {
      userMessage: 'Access denied',
      actionMessage: 'You don\'t have permission to perform this action.',
    };
  }

  // Default fallback
  return {
    userMessage: 'Something went wrong',
    actionMessage: 'Please try again. If the problem persists, contact support.',
  };
}

