import { Component, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputOtp } from 'primeng/inputotp';
import { AuthApiService } from '@org/data-access';
import { Message } from '@org/data-access';
import {
  Button,
  TitleFormComponent,
  DarkModeService
} from '@org/ui';
import { RegistrationStateService } from '../../core/services/registration-state.service';

@Component({
  selector: 'app-otp-code',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    RouterLink,
    InputOtp,
    Button,
    TitleFormComponent,
  ],
  templateUrl: './otp-code.component.html',
  styleUrls: ['./otp-code.component.scss'],
})
export class OtpCodeComponent implements OnDestroy {
  private readonly authApiService = inject(AuthApiService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
 readonly registrationState = inject(RegistrationStateService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  readonly isResending = signal(false);
  readonly cooldown = signal(0);

  otpValue = '';
  private cooldownInterval: ReturnType<typeof setInterval> | null = null;

  get isOtpComplete(): boolean {
    return this.otpValue?.toString().length === 6;
  }

  onSubmit(): void {
    if (!this.isOtpComplete) return;

    this.isLoading.set(true);
    this.authApiService.confirmEmailVerification({
      email: this.registrationState.email(),
      code: this.otpValue.toString()
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status) {
          this.messageService.show('success', res.message || 'OTP verified successfully!');
          this.router.navigate(['../register']);
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
    }).subscribe({
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
    this.cooldownInterval = setInterval(() => {
      this.cooldown.update(v => {
        if (v <= 1) {
          clearInterval(this.cooldownInterval!);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }
}
