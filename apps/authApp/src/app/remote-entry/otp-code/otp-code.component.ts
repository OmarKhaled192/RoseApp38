import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputOtp } from 'primeng/inputotp';
import { timer } from 'rxjs';
import { Message } from '@org/data-access';
import {
  Button,
  TitleFormComponent,
  DarkModeService,
  ParagraphComponent,
} from '@org/ui';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { RegistrationStateService } from '../../core/services/registration-state.service';

@Component({
  selector: 'app-otp-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    InputOtp,
    Button,
    TitleFormComponent,
    ParagraphComponent,
  ],
  templateUrl: './otp-code.component.html',
  styleUrls: ['./otp-code.component.scss'],
})
export class OtpCodeComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  private readonly destroyRef = inject(DestroyRef);
  readonly registrationState = inject(RegistrationStateService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly cooldown = signal(0);

  otpValue = '';

  get isOtpComplete(): boolean {
    return this.otpValue?.toString().length === 6;
  }

  onSubmit(): void {
    if (!this.isOtpComplete) return;

    this.isLoading.set(true);
    this.authApiService.confirmEmailVerification({
      email: this.registrationState.email(),
      code: this.otpValue.toString()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status) {
            this.messageService.show('success', res.message || 'OTP verified successfully!');
            this.router.navigate(['/auth/register-details']);
          } else {
            this.messageService.show('error', res.message || 'Invalid or expired OTP');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
        }
      });
  }

  onResend(): void {
    if (this.cooldown() > 0 || this.isResending()) return;

    this.isResending.set(true);
    this.authApiService.sendEmailVerification({
      email: this.registrationState.email()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isResending.set(false);
          if (res.status) {
            this.messageService.show('success', res.message || 'OTP resent successfully!');
            this.startCooldown();
          } else {
            this.messageService.show('error', res.message || 'Failed to resend OTP');
          }
        },
        error: (err) => {
          this.isResending.set(false);
          this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
        }
      });
  }

  private startCooldown(): void {
    this.cooldown.set(60);
    timer(0, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cooldown.update(v => (v <= 1 ? 0 : v - 1));
      });
  }
}
