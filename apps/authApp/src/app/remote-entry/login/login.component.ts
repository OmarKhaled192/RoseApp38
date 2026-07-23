import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthFacade } from '../../features/auth/auth.facade';
import {
  InputComponent,
  Button,
  Checkbox,
  TitleFormComponent,
  QuestionRepeatComponent,
  DarkModeService,
} from '@org/ui';
import { LoginRequest } from '../../features/auth/models/login';
import { authStore } from '../../features/auth/state/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    InputComponent,
    Button,
    Checkbox,
    TitleFormComponent,
    QuestionRepeatComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  private readonly darkModeService = inject(DarkModeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authStore = inject(authStore);
  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = this.authFacade.isLoading;
  readonly rememberMe = signal(false);

  readonly loginForm = signal(
    this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    }),
  );

  onSubmit(): void {
    const form = this.loginForm();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.authStore.login(form.value as LoginRequest);
  }
}
