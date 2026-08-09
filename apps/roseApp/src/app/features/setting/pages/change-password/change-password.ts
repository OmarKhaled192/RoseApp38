import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { InputComponent } from '@org/ui';
import { Message } from '@org/data-access';
import { ProfileService } from '../../service/profile';


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    TranslatePipe,
  ],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly messageService = inject(Message);
  private readonly translateService = inject(TranslateService);

  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
        ],
      ],

      confirmPassword: [
        '',
        [
          Validators.required,
        ],
      ],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  get currentPasswordControl() {
    return this.form.controls.currentPassword;
  }

  get newPasswordControl() {
    return this.form.controls.newPassword;
  }

  get confirmPasswordControl() {
    return this.form.controls.confirmPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      currentPassword: this.form.controls.currentPassword.value,
      newPassword: this.form.controls.newPassword.value,
      confirmPassword: this.form.controls.confirmPassword.value,
    };

    this.isSubmitting.set(true);

    this.profileService
      .changePassword(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Password changed successfully', response);
          this.messageService.show(
            'success',
            response.message || this.translateService.instant('profile.passwordChangedSuccess')
          );
          this.form.reset();
        },

        error: (error) => {
          console.error('Change password failed', error);
          this.messageService.show(
            'error',
            error.error?.message || this.translateService.instant('profile.passwordChangeFailed')
          );
        },
      });
  }
}
