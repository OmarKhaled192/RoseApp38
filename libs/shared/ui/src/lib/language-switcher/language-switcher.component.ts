import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';

import { LanguageService } from './language.service';

@Component({
  selector: 'lib-language-switcher',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);

  readonly languageChanged = output<'en' | 'ar'>();

  readonly currentLang = this.languageService.currentLang;

  readonly nextLanguageLabel = computed(() =>
    this.currentLang() === 'ar' ? 'English' : 'العربية'
  );

  toggleLanguage(): void {
    this.languageService.toggle();

    this.languageChanged.emit(this.currentLang());
  }
}
