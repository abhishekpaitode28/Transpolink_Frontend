// This file wires up all Angular providers for the application.
// You should not need to change this file unless adding a new global provider.

// Key providers:
//   provideZonelessChangeDetection — replaces zone.js with signal-based CD
//   provideRouter                  — registers all app routes
//   withComponentInputBinding      — allows route params to be bound as @Input()
//   provideHttpClient              — enables HttpClient across the app
//   withInterceptors               — attaches the JWT token interceptor
//   provideAnimationsAsync         — enables Angular animations

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
// import { tokenInterceptor } from './core/services/token.interceptor';
import { tokenInterceptor } from './core/auth/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),  // JWT attached to every request
    provideAnimationsAsync(),
  ],
};