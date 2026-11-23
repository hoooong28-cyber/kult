import { NextResponse } from 'next/server';

const destinations = new Set(['/archive', '/taste-neighbors', '/']);

export function accountDestination(value: unknown) {
  return typeof value === 'string' && destinations.has(value) ? value : '/archive';
}

export function canonicalAccountOrigin(): string | null {
  const configured = process.env.KULT_SITE_ORIGIN?.trim();
  try {
    if (!configured) return null;
    const url = new URL(configured);
    return url.protocol === 'https:' && !url.username && !url.password &&
      url.pathname === '/' && !url.search && !url.hash ? url.origin : null;
  } catch {
    return null;
  }
}

export function accountOrigin(request: Request): string | null {
  const canonical = canonicalAccountOrigin();
  if (canonical || process.env.NODE_ENV === 'production') return canonical;
  const { hostname, origin, protocol } = new URL(request.url);
  return protocol === 'http:' && (hostname === 'localhost' || hostname === '127.0.0.1') ? origin : null;
}

export function trustedPost(request: Request, origin: string | null): origin is string {
  return origin !== null && request.headers.get('origin') === origin;
}

export function accountPath(next: string, status?: string) {
  const query = new URLSearchParams({ next });
  if (status) query.set('status', status);
  return '/account?' + query;
}

export function privateRedirect(destination: string | URL) {
  return NextResponse.redirect(destination, {
    status: 303,
    headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' },
  });
}
