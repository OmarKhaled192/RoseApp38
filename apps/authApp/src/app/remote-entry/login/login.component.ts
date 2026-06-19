import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthApiService } from '@org/data-access';
import { Message } from '@org/data-access';
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
  private readonly authApiService = inject(AuthApiService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
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

    this.isLoading.set(true);
    this.authApiService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status) {
          localStorage.setItem('token', res.payload);
          this.messageService.show('success', res.message || 'Login successful!');
          this.router.navigate(['/']);
        } else {
          this.messageService.show('error', res.message || 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
      }
    });
  }
}