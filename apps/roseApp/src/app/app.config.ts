import { DOCUMENT } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { CART_PORT, CartStore } from '@org/ui';
import { appRoutes } from './app.routes';
import { authenticationInterceptor } from '@org/auth';


const DEFAULT_LANG: 'en' | 'ar' = 'en';  

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
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
      provide: CART_PORT,
      useExisting: CartStore,
    },
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
