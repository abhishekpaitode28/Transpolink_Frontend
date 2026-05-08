// ^This file wires up all Angular providers for the application.
// ^You should not need to change this file unless adding a new global provider.

import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
<<<<<<< HEAD
import { tokenInterceptor } from './core/auth/token.interceptor';
=======
// import { tokenInterceptor } from './core/services/token.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
>>>>>>> 52a64e8a388e5f87008008339524bfca074cdeb2

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([tokenInterceptor])),  
  ],
};