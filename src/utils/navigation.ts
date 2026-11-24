import type { PageRoute } from '../types/restaurant';

export const ROUTE_PATHS: Record<PageRoute, string> = {
  home: '/',
  story: '/historia',
  menu: '/carta',
  reservations: '/reservas',
  location: '/ubicacion',
};

const HASH_TO_ROUTE: Record<string, PageRoute> = {
  '#inicio': 'home',
  '#historia': 'story',
  '#carta': 'menu',
  '#reservas': 'reservations',
  '#ubicacion': 'location',
};

export function getPathForRoute(route: PageRoute): string {
  return ROUTE_PATHS[route] ?? '/';
}

export function parseRouteFromLocation(pathname: string, hash = ''): PageRoute {
  const normalizedPath = pathname.trim().toLowerCase().replace(/\/+$/, '') || '/';

  if (normalizedPath === '/historia') return 'story';
  if (normalizedPath === '/carta') return 'menu';
  if (normalizedPath === '/reservas') return 'reservations';
  if (normalizedPath === '/ubicacion') return 'location';

  const normalizedHash = hash.trim().toLowerCase();
  if (normalizedHash in HASH_TO_ROUTE) {
    return HASH_TO_ROUTE[normalizedHash];
  }

  return 'home';
}
