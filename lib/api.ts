/**
 * API client for backend services
 */

// Backend service URLs
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8001';
const DIAGNOSTICS_SERVICE_URL = process.env.NEXT_PUBLIC_DIAGNOSTICS_SERVICE_URL || 'http://localhost:8006';

/**
 * Get authentication token from Supabase
 */
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // Dynamic import to avoid circular dependency
  const { supabase } = await import('./supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
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
      DIAGNOSTICS_SERVICE_URL,
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
      DIAGNOSTICS_SERVICE_URL,
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
      DIAGNOSTICS_SERVICE_URL,
      `/api/v1/diagnostics/${sessionId}/complete`,
      { method: 'POST' }
    );
  },

  /**
   * Get diagnostic status
   */
  async getDiagnosticStatus(sessionId: string) {
    return apiRequest(
      DIAGNOSTICS_SERVICE_URL,
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
      DIAGNOSTICS_SERVICE_URL,
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
      DIAGNOSTICS_SERVICE_URL,
      `/api/v1/roadmaps/${roadmapId}`,
      { method: 'GET' }
    );
  },

  /**
   * List all roadmaps for current user
   */
  async listRoadmaps(): Promise<RoadmapListResponse> {
    return apiRequest<RoadmapListResponse>(
      DIAGNOSTICS_SERVICE_URL,
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
      DIAGNOSTICS_SERVICE_URL,
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
      USER_SERVICE_URL,
      '/api/v1/users/me',
      { method: 'GET' }
    );
  },

  /**
   * Update user profile
   */
  async updateProfile(updateData: Partial<UserProfile>): Promise<UserProfile> {
    return apiRequest<UserProfile>(
      USER_SERVICE_URL,
      '/api/v1/users/me',
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );
  },
};

