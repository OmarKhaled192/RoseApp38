import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeComponent, LanguageSwitcherComponent } from '@org/ui';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, LanguageSwitcherComponent, DarkModeComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {
  currentYear = new Date().getFullYear();
}
