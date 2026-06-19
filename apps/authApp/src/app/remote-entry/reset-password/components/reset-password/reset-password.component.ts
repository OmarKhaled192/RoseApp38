import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputComponent, Button, QuestionRepeatComponent, DarkModeService } from "@org/ui";
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MustMatch } from '../../../../core/services/confirm-pass.validator';
import { ResetPasswordService } from '../../services/reset-password';
import { Message, ValidationMessagesService } from '@org/data-access';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, TranslatePipe, InputComponent, Button, QuestionRepeatComponent , ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly resetPasswordService = inject(ResetPasswordService);
  private readonly translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);

  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(Message);
  private readonly validationMessagesService = inject(ValidationMessagesService);
  private readonly darkModeService = inject(DarkModeService);
  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  form!: FormGroup;
  newPassword!: FormControl;
  confirmPassword!: FormControl;
  token!: FormControl;


  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(3)]],
        token: ['']
      },
      { validators: MustMatch('newPassword', 'confirmPassword') } as AbstractControlOptions
    );
    this.newPassword = this.form.controls['newPassword'] as FormControl;
    this.confirmPassword = this.form.controls['confirmPassword'] as FormControl;
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token.setValue(this.token)
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.resetPasswordService
        .post(this.form.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.messageService.show('success', this.translateService.instant('msg.password-changed'));
            this.isLoading.set(false);
            this.form.reset();
          },
          error: () => {
            this.isLoading.set(false);
            this.form.reset();
          }
        });
    } else {
      this.validationMessagesService.validateAllFormFields(this.form);
    }
  }
}
