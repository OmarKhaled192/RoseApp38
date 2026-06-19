import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthApiService, Message, ValidationMessagesService } from '@org/data-access';
import { DarkModeService } from '@org/ui';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './forget-password.component.html'
})
export class ForgetPasswordComponent implements OnInit {
   private readonly fb = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(Message);
  private readonly validationMessagesService = inject(ValidationMessagesService);
  private readonly darkModeService = inject(DarkModeService);
  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  form!: FormGroup;
  email!: FormControl;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]]
      },
    );
    this.email = this.form.controls['newPassword'] as FormControl;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.authApiService
        .post(this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.show('success', this.translateService.instant('msg.password-send'));
            this.isLoading.set(false);
            this.form.reset();
          },
          error: () => {
            this.isLoading.set(false);
            this.form.reset();
            this.messageService.show('error',this.translateService.instant('msg.invalid-email'));
          }
        });
    } else {
      this.validationMessagesService.validateAllFormFields(this.form);
    }
  }
 }
