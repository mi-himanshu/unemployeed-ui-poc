export const ROUTES = {
    home: '/',
    pricing: '/pricing',
    contact: '/contact',
    about: '/about',
    login: '/login',
    diagnostic: '/diagnostics',
    profile: '/profile',
    dashboard: '/dashboard',
    roadmap: '/roadmap',
  } as const
  
  export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
  