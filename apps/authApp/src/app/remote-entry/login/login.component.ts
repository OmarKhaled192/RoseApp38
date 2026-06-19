import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthFacade } from '../../features/auth/auth.facade';
import {
  InputComponent,
  Button,
  Checkbox,
  TitleFormComponent,
  QuestionRepeatComponent,
  DarkModeService
} from '@org/ui';

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
    QuestionRepeatComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  private readonly darkModeService = inject(DarkModeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = this.authFacade.isLoading;
  readonly rememberMe = signal(false);

  readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get usernameError(): string {
    const control = this.loginForm.get('username');
    if (control?.touched && control?.errors?.['required']) {
      return 'Username is required';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.touched && control?.errors?.['required']) {
      return 'Password is required';
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authFacade.login(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}