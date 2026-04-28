import { Injectable, signal, computed } from '@angular/core';

const THEME_KEY = 'tl_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDark = signal<boolean>(
    localStorage.getItem(THEME_KEY) === 'dark'
  );

  readonly isDark = this._isDark.asReadonly();
  readonly icon   = computed(() => this._isDark() ? 'light_mode' : 'dark_mode');
  readonly label  = computed(() => this._isDark() ? 'Light mode' : 'Dark mode');

  constructor() {
    // Apply on startup
    this.applyTheme(this._isDark());
  }

  toggle(): void {
    const newValue = !this._isDark();
    this._isDark.set(newValue);
    localStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light');
    this.applyTheme(newValue);  // ← apply immediately, no effect() needed
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('tl-dark');
    } else {
      document.body.classList.remove('tl-dark');
    }
  }
}