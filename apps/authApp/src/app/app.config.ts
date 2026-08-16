import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { authenticationInterceptor } from '@org/auth';

const DEFAULT_LANG = 'en';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
  provideHttpClient(withInterceptors([authenticationInterceptor])),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideTranslateService({
      lang: DEFAULT_LANG,
      fallbackLang: DEFAULT_LANG,
    }),
    provideTranslateHttpLoader({ prefix: 'assets/i18n/', suffix: '.json' }),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => () => {
        const document = inject(DOCUMENT);
        document.documentElement.lang = DEFAULT_LANG;
        document.documentElement.dir = (DEFAULT_LANG as string) === 'ar' ? 'rtl' : 'ltr';
        return Promise.resolve();
      },
    },
    provideRouter(appRoutes),
  ],
};
