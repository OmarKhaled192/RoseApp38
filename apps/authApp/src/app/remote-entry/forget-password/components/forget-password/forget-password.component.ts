import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message, ValidationMessagesService } from '@org/data-access';
import { DarkModeService, Button, QuestionRepeatComponent, InputComponent, ParagraphComponent } from '@org/ui';
import { forgetPasswordService } from '../../services/forget-password';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, Button, QuestionRepeatComponent, InputComponent, ParagraphComponent],
  templateUrl: './forget-password.component.html'
})
export class ForgetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly forgetPasswordService = inject(forgetPasswordService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(Message);
  private readonly validationMessagesService = inject(ValidationMessagesService);
  private readonly darkModeService = inject(DarkModeService);

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);

  readonly form = signal(
    this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    }),
  );

  onSubmit(): void {
    const form = this.form();

    if (form.valid) {
      this.isLoading.set(true);
      this.forgetPasswordService
        .post(form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res.status) {
              this.messageService.show(
                'success',
                res.message || this.translateService.instant('msg.password-send'),
              );
              form.reset();
            } else {
              this.messageService.show(
                'error',
                res.message || this.translateService.instant('msg.invalid-email'),
              );
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            this.messageService.show(
              'error',
              err.error?.message || this.translateService.instant('msg.invalid-email'),
            );
          },
        });
    } else {
      this.validationMessagesService.validateAllFormFields(form);
    }
  }
}
