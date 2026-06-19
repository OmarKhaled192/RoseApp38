import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);

  readonly currentLang = signal<'en' | 'ar'>(
    (this.translate.currentLang as unknown as 'en' | 'ar') || 'en'
  );

  constructor() {
    this.updateDocument(this.currentLang());
  }

  toggle(): void {
    const lang = this.currentLang() === 'ar' ? 'en' : 'ar';

    this.currentLang.set(lang);

    this.translate.use(lang);

    this.updateDocument(lang);
  }

  setLanguage(lang: 'en' | 'ar'): void {
    this.currentLang.set(lang);

    this.translate.use(lang);

    this.updateDocument(lang);
  }

  private updateDocument(lang: 'en' | 'ar'): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir =
      lang === 'ar' ? 'rtl' : 'ltr';
  }
}
