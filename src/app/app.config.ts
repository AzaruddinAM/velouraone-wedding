import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Route params & query params arrive as component inputs (e.g. `slug`, `category`).
    // Scrolling is handled in `App` so that filter changes don't jump to the top.
    provideRouter(routes, withComponentInputBinding()),
  ],
};
