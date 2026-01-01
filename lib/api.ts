/**
 * API client for backend services via API Gateway
 */

// API Gateway URL - all requests go through the gateway
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';

/**
 * Get authentication token from localStorage (set by AuthContext)
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // Token is stored by AuthContext after login/signup
  return localStorage.getItem('auth_token');
}

/**
 * Make authenticated API request through gateway
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${GATEWAY_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `API request failed: ${response.statusText}`);
  }

  return response.json();
}

// ==================== Types ====================

export interface Question {
  question_id: string;
  question_text: string;
  category: string;
  order: number;
}

export interface StartDiagnosticResponse {
  session_id: string;
  status: string;
  questions: Question[];
}

export interface SubmitResponseRequest {
  responses: Record<string, string>;
}

export interface SubmitResponseResponse {
  success: boolean;
  status: string;
  complete_items: any[];
  missing_items: any[];
  needs_clarification: any[];
  followup_questions?: Question[];
}

export interface CompleteDiagnosticResponse {
  success: boolean;
  session_id: string;
  diagnostic_id: string;
  checklist_complete: boolean;
}

export interface GenerateRoadmapRequest {
  session_id: string;
  target_company?: string;
  target_role?: string;
}

export interface GenerateRoadmapResponse {
  status: string;
  roadmap_id: string;
  message?: string;
}

export interface Milestone {
  milestone_index: number;
  title: string;
  description: string;
  skill_area: string;
  tasks: string[];
  estimated_weeks: number;
  resources: string[];
  success_criteria: string[];
  status?: string;
}

export interface RoadmapResponse {
  id: string;
  user_id: string;
  diagnostic_session_id?: string;
  target_company: string;
  target_role: string;
  title: string;
  description: string;
  milestones: Milestone[];
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface RoadmapListResponse {
  roadmaps: RoadmapResponse[];
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== Career Diagnostics API ====================

export const diagnosticsApi = {
  /**
   * Start a new diagnostic session
   */
  async startDiagnostic(): Promise<StartDiagnosticResponse> {
    return apiRequest<StartDiagnosticResponse>(
      '/api/v1/diagnostics/start',
      { method: 'POST' }
    );
  },

  /**
   * Submit diagnostic responses
   */
  async submitResponse(
    sessionId: string,
    responses: Record<string, string>
  ): Promise<SubmitResponseResponse> {
    return apiRequest<SubmitResponseResponse>(
      `/api/v1/diagnostics/${sessionId}/respond`,
      {
        method: 'POST',
        body: JSON.stringify({ responses }),
      }
    );
  },

  /**
   * Complete diagnostic session
   */
  async completeDiagnostic(sessionId: string): Promise<CompleteDiagnosticResponse> {
    return apiRequest<CompleteDiagnosticResponse>(
      `/api/v1/diagnostics/${sessionId}/complete`,
      { method: 'POST' }
    );
  },

  /**
   * Get diagnostic status
   */
  async getDiagnosticStatus(sessionId: string) {
    return apiRequest(
      `/api/v1/diagnostics/${sessionId}`,
      { method: 'GET' }
    );
  },
};

// ==================== Roadmap API ====================

export const roadmapApi = {
  /**
   * Generate roadmap from completed diagnostic
   */
  async generateRoadmap(
    sessionId: string,
    targetCompany?: string,
    targetRole?: string
  ): Promise<GenerateRoadmapResponse> {
    return apiRequest<GenerateRoadmapResponse>(
      '/api/v1/roadmaps/generate',
      {
        method: 'POST',
        body: JSON.stringify({
          session_id: sessionId,
          target_company: targetCompany,
          target_role: targetRole,
        }),
      }
    );
  },

  /**
   * Get roadmap by ID
   */
  async getRoadmap(roadmapId: string): Promise<RoadmapResponse> {
    return apiRequest<RoadmapResponse>(
      `/api/v1/roadmaps/${roadmapId}`,
      { method: 'GET' }
    );
  },

  /**
   * List all roadmaps for current user
   */
  async listRoadmaps(): Promise<RoadmapListResponse> {
    return apiRequest<RoadmapListResponse>(
      '/api/v1/roadmaps',
      { method: 'GET' }
    );
  },

  /**
   * Update milestone status
   */
  async updateMilestone(
    roadmapId: string,
    milestoneId: string,
    status?: string,
    completedAt?: string
  ) {
    return apiRequest(
      `/api/v1/roadmaps/${roadmapId}/milestones/${milestoneId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          status,
          completed_at: completedAt,
        }),
      }
    );
  },
};

// ==================== User API ====================

export const userApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      '/api/v1/users/me',
      { method: 'GET' }
    );
  },

  /**
   * Update user profile
   */
  async updateProfile(updateData: Partial<UserProfile>): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      '/api/v1/users/me',
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );
  },
};

// ==================== Auth API ====================

export const authApi = {
  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
    // Get the frontend URL for email redirect
    const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const redirectTo = `${frontendUrl}/verify-email`;
    
    const response = await fetch(`${GATEWAY_URL}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, redirect_to: redirectTo }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to resend verification email');
    }

    return response.json();
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string, tokenHash?: string, type: string = 'email'): Promise<{ user: any; session: any }> {
    const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
    const response = await fetch(`${GATEWAY_URL}/api/v1/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, token_hash: tokenHash, type }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to verify email');
    }

    return response.json();
  },

  /**
   * Check if email is verified
   */
  async checkEmailVerification(): Promise<{ email_verified: boolean }> {
    return apiRequest<{ email_verified: boolean }>(
      '/api/v1/auth/check-verification',
      { method: 'GET' }
    );
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
    // Get the frontend URL for email redirect
    const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const redirectTo = `${frontendUrl}/reset-password`;
    
    const response = await fetch(`${GATEWAY_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, redirect_to: redirectTo }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to send password reset email');
    }

    return response.json();
  },

  /**
   * Reset password with new password
   */
  async resetPassword(newPassword: string, accessToken?: string): Promise<{ user: any; session: any }> {
    const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
    const response = await fetch(`${GATEWAY_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        new_password: newPassword, 
        ...(accessToken ? { access_token: accessToken } : {}) 
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to reset password');
    }

    return response.json();
  },

  /**
   * Get auth headers for authenticated requests
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// ==================== Contact API ====================

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactApi = {
  /**
   * Submit contact form
   */
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8000';
    
    // Contact form can be submitted without authentication
    const response = await fetch(`${GATEWAY_URL}/api/v1/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || 'Failed to submit contact form');
    }

    return response.json();
  },
};

