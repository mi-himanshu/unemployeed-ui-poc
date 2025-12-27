export const ROUTES = {
    home: '/',
    pricing: '/pricing',
    contact: '/contact',
    about: '/about',
    login: '/login',
    diagnostic: '/diagnostic',
  } as const
  
  export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
  