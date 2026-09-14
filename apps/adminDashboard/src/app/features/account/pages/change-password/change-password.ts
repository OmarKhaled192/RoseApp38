import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { Button } from '@org/ui';
import { Message } from '@org/data-access';
import { finalize } from 'rxjs';
import { AdminAccountService } from '../../service/account.service';

@Component({
  selector: 'app-admin-change-password',
  imports: [ReactiveFormsModule, TranslatePipe, PasswordModule, Button],
  templateUrl: './change-password.html',
  host: {
    class:
      'block mx-auto w-full max-w-[1240px] text-zinc-800 dark:text-zinc-100',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminChangePassword {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AdminAccountService);
  private readonly message = inject(Message);
  private readonly destroyRef = inject(DestroyRef);
  readonly isSubmitting = signal(false);
  readonly form = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: (control: AbstractControl) =>
        control.get('newPassword')?.value ===
        control.get('confirmPassword')?.value
          ? null
          : { passwordMismatch: true },
    },
  );
  save(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.api
      .changePassword(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (!response.status) {
            this.message.show(
              'error',
              response.message || 'adminAccount.passwordFailed',
            );
            return;
          }
          this.message.show(
            'success',
            response.message || 'adminAccount.passwordChanged',
          );
          this.form.reset();
        },
        error: (error) =>
          this.message.show(
            'error',
            error.error?.message || 'adminAccount.passwordFailed',
          ),
      });
  }
}
