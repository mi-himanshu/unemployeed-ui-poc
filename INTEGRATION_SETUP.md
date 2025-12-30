# Frontend-Backend Integration Setup Guide

## Overview

This guide explains how to set up the complete integration between the frontend (Next.js) and backend services (platform-core).

## Prerequisites

1. Node.js 18+ installed
2. Supabase project created
3. Backend services running (user-service on port 8001, career-diagnostics on port 8006)

## Installation

1. Install dependencies:
```bash
cd web-app
npm install
```

## Environment Variables

Create a `.env.local` file in the `web-app` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Gateway URL (all requests go through the gateway)
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8000
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key
4. Paste them into your `.env.local` file

### OAuth Setup (Google & Apple)

1. In Supabase dashboard, go to Authentication > Providers
2. Enable Google OAuth:
   - Add your Google OAuth Client ID and Secret
   - Set redirect URL: `http://localhost:3000/auth/callback` (for development)
3. Enable Apple OAuth (if needed):
   - Configure Apple OAuth settings
   - Set redirect URL: `http://localhost:3000/auth/callback`

## Running the Application

1. Start the backend services (from platform-core directory):
```bash
# Start API Gateway (required - all requests go through this)
cd services/api-gateway
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Start user-service
cd ../user-service
python -m uvicorn app:app --host 0.0.0.0 --port 8001

# Start career-diagnostics service
cd ../career-diagnostics
python -m uvicorn app:app --host 0.0.0.0 --port 8006
```

2. Start the frontend:
```bash
cd web-app
npm run dev
```

3. Open http://localhost:3000 in your browser

**Note**: The API Gateway must be running before the frontend can make API calls. All requests from the frontend go through the gateway, which handles authentication and routes to backend services.

## Features Integrated

### Authentication
- ✅ Email/Password sign up and login
- ✅ OAuth with Google
- ✅ OAuth with Apple
- ✅ Real-time session management
- ✅ Protected routes
- ✅ Automatic token refresh

### Diagnostics Flow
- ✅ Fetch questions from backend database
- ✅ Submit answers to backend
- ✅ Handle follow-up questions
- ✅ Verify checklist completion
- ✅ Generate roadmap automatically

### Roadmap Flow
- ✅ Fetch roadmap from backend
- ✅ Display milestones organized by phases
- ✅ Track milestone progress
- ✅ Update milestone status

### Dashboard
- ✅ Display user profile
- ✅ Show roadmap status
- ✅ Quick access to diagnostics and roadmap

## Architecture

### Authentication Flow
1. User signs up/logs in via Supabase Auth
2. Supabase returns JWT token
3. Token is stored in session
4. Frontend sends requests to API Gateway with token in Authorization header
5. API Gateway verifies token with Supabase and extracts user data
6. API Gateway forwards request to backend service with token
7. Backend service verifies token (can use same token or gateway can inject user context)

### Diagnostics Flow
1. User starts diagnostic → `POST /api/v1/diagnostics/start`
2. Backend returns questions from database
3. User answers questions → `POST /api/v1/diagnostics/{session_id}/respond`
4. Backend verifies answers against checklist
5. If incomplete, backend generates follow-up questions
6. When complete → `POST /api/v1/diagnostics/{session_id}/complete`
7. Generate roadmap → `POST /api/v1/roadmaps/generate`
8. Redirect to roadmap page

### Roadmap Flow
1. Fetch roadmap → `GET /api/v1/roadmaps/{roadmap_id}` or `GET /api/v1/roadmaps`
2. Backend returns roadmap with milestones
3. Frontend maps milestones to phases
4. User can update milestone status → `PUT /api/v1/roadmaps/{roadmap_id}/milestones/{milestone_id}`

## File Structure

```
web-app/
├── app/
│   ├── auth/
│   │   └── callback/          # OAuth callback handler
│   ├── dashboard/             # Dashboard page (protected)
│   ├── diagnostics/           # Diagnostics page (protected)
│   ├── login/                 # Login page
│   ├── roadmap/                # Roadmap page (protected)
│   └── signup/                # Signup page
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
├── lib/
│   ├── api.ts                 # API client for backend services
│   └── supabase.ts            # Supabase client configuration
└── .env.local                 # Environment variables (create this)
```

## Troubleshooting

### Authentication Issues
- Verify Supabase credentials are correct
- Check that OAuth redirect URLs match in Supabase dashboard
- Ensure backend services can verify Supabase tokens

### API Connection Issues
- Verify backend services are running on correct ports
- Check CORS settings in backend services
- Verify environment variables are set correctly

### Roadmap Not Loading
- Ensure diagnostic is completed first
- Check that roadmap was generated successfully
- Verify user has access to the roadmap

## Next Steps

1. **Production Deployment**:
   - Update environment variables for production
   - Configure production Supabase project
   - Set up production backend URLs
   - Configure OAuth redirect URLs for production domain

2. **Enhanced Features**:
   - Add real-time roadmap updates via WebSocket
   - Implement milestone progress tracking
   - Add notifications for roadmap milestones
   - Integrate resume builder service

3. **Security**:
   - Implement rate limiting
   - Add request validation
   - Set up monitoring and logging
   - Configure proper CORS policies

