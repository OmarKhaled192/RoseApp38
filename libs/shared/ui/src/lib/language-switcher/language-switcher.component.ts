import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import { LanguageService } from './language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-language-switcher',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);

  readonly languageChanged = output<'en' | 'ar'>();
  readonly baseClasses =
    'inline-flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-medium transition ';

  readonly classList = input<string>('');

  readonly currentLang = this.languageService.currentLang;

  readonly nextLanguageLabel = computed(() =>
    this.currentLang() === 'ar' ? 'English' : 'العربية'
  );

  toggleLanguage(): void {
    this.languageService.toggle();
    this.languageChanged.emit(this.currentLang());
  }
}
