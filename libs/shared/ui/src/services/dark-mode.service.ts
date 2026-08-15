import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private readonly document = inject(DOCUMENT);

  readonly isDark = signal(this.resolveInitialTheme());

  constructor() {
    this.updateDocument(this.isDark());
  }

  toggle(): void {
    const dark = !this.isDark();
    this.isDark.set(dark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    this.updateDocument(dark);
  }

  setTheme(isDark: boolean): void {
    this.isDark.set(isDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    this.updateDocument(isDark);
  }

  private resolveInitialTheme(): boolean {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  }

  private updateDocument(isDark: boolean): void {
    if (typeof window !== 'undefined') {
      const html = this.document.documentElement;
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}
