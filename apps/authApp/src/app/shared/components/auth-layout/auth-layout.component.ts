import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);

  currentLang = 'en';
  currentYear = new Date().getFullYear();

  constructor() {
    this.currentLang = this.translate.currentLang() || 'en';
    this.updateDir();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.translate.use(this.currentLang);
    this.updateDir();
  }

  private updateDir() {
    this.document.documentElement.lang = this.currentLang;
    this.document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
