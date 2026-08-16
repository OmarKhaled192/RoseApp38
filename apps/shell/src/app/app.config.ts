import { DOCUMENT } from '@angular/common';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  APP_INITIALIZER,
  inject,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { appRoutes } from './app.routes';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { authenticationInterceptor } from '@org/auth';


const DEFAULT_LANG: 'en' | 'ar' = 'en';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    const urls = [
      `assets/i18n/${lang}.json`,
      `assets/i18n/authApp/${lang}.json`,
      `assets/i18n/roseApp/${lang}.json`,
      `assets/i18n/adminDashboard/${lang}.json`
    ];

    const requests = urls.map(url =>
      this.http.get(url).pipe(
        catchError(err => {
          console.warn(`Could not load translations from ${url}`, err);
          return of({});
        })
      )
    );

    return forkJoin(requests).pipe(
      map(translations => {
        const merged: any = {};
        for (const t of translations) {
          this.deepMerge(merged, t);
        }
        return merged;
      })
    );
  }

  private deepMerge(target: any, source: any): any {
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
}


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
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new MultiTranslateHttpLoader(http),
        deps: [HttpClient]
      },
      lang: DEFAULT_LANG,
      fallbackLang: DEFAULT_LANG,
    }),
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
