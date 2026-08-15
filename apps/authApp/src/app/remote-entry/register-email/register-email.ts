import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from '@org/data-access';
import {
  InputComponent,
  Button,
  TitleFormComponent,
  QuestionRepeatComponent,
  DarkModeService
} from '@org/ui';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { RegistrationStateService } from '../../core/services/registration-state.service';

@Component({
  selector: 'app-register-email',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    InputComponent,
    Button,
    TitleFormComponent,
    QuestionRepeatComponent],
  templateUrl: './register-email.html',
  styleUrl: './register-email.scss',
})
export class RegisterEmail {
  private readonly fb = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly registrationState = inject(RegistrationStateService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);

  readonly registerEmailForm = signal(
    this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    }),
  );

  onSubmit(): void {
    const form = this.registerEmailForm();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const email = form.getRawValue().email as string;

    this.authApiService.sendEmailVerification({ email }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status) {
          this.registrationState.setEmail(email);
          this.messageService.show('success', res.message || 'OTP sent successfully!');
          this.router.navigate(['/auth/otp-code']);
        } else {
          this.messageService.show('error', res.message || 'Email already registered');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
      }
    });
  }
}
