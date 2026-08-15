import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputComponent, Button, QuestionRepeatComponent, DarkModeService, ParagraphComponent } from "@org/ui";
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MustMatch } from '../../../../core/services/confirm-pass.validator';
import { ResetPasswordService } from '../../services/reset-password';
import { Message, ValidationMessagesService } from '@org/data-access';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputComponent, Button, QuestionRepeatComponent, ParagraphComponent, ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly resetPasswordService = inject(ResetPasswordService);
  private readonly translateService = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(Message);
  private readonly validationMessagesService = inject(ValidationMessagesService);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);

  readonly form = signal(
    this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
        token: [''],
      },
      { validators: MustMatch('newPassword', 'confirmPassword') } as AbstractControlOptions,
    ),
  );

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        if (params['token']) {
          this.form().controls['token'].setValue(params['token']);
        }
      });
  }

  onSubmit(): void {
    const form = this.form();

    if (form.valid) {
      this.isLoading.set(true);
      this.resetPasswordService
        .post(form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res.status) {
              this.messageService.show(
                'success',
                res.message || this.translateService.instant('msg.password-changed'),
              );
              form.reset();
              this.router.navigate(['/auth/login']);
            } else {
              this.messageService.show(
                'error',
                res.message || this.translateService.instant('msg.password-changed'),
              );
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            this.messageService.show(
              'error',
              err.error?.message || this.translateService.instant('msg.invalid-email'),
            );
          }
        });
    } else {
      this.validationMessagesService.validateAllFormFields(form);
    }
  }
}
