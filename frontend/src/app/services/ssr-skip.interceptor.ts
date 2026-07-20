import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { throwError } from 'rxjs';

// Skips /api/* calls during server-side prerendering — the build has no live
// backend to reach, and every caller already has a graceful error/empty state
// for the browser case, so this just reuses that path at build time.
export const ssrSkipInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId) && req.url.startsWith('/api')) {
    return throwError(() => new Error('Skipping API call during prerender'));
  }
  return next(req);
};
