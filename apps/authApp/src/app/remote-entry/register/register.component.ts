import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControlOptions,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Message } from '@org/data-access';
import {
  InputComponent,
  Button,
  TitleFormComponent,
  QuestionRepeatComponent,
  DarkModeService,
} from '@org/ui';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { RegistrationStateService } from '../../core/services/registration-state.service';
import { MustMatch } from '../../core/services/confirm-pass.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    RouterLink,
    InputComponent,
    Button,
    TitleFormComponent,
    QuestionRepeatComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly messageService = inject(Message);
  private readonly router = inject(Router);
  private readonly darkModeService = inject(DarkModeService);
  readonly registrationState = inject(RegistrationStateService);
  private readonly translateService = inject(TranslateService);
  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);

  readonly genderOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
  ];

  readonly registerForm = signal(
    this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: MustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions,
    ),
  );


    constructor() {
    effect(() => {
      const verifiedEmail = this.registrationState.email();
      if (!verifiedEmail) {
        this.router.navigate(['/auth/register']);
        return;
      }
      const form = this.registerForm();
     form.controls['email'].setValue(verifiedEmail);
     form.controls.email.disable();
    });
  }


  onSubmit(): void {
    const form = this.registerForm();

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
    } = form.getRawValue();

    this.isLoading.set(true);

    this.authApiService
      .register({
        firstName: firstName!,
        lastName: lastName!,
        username: username!,
        email: this.registrationState.email(),
        password: password!,
        confirmPassword: confirmPassword!,
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.status) {
          this.registrationState.clear();
          this.messageService.show('success', res.message || this.translateService.instant('auth.accountCreated'));
          this.router.navigate(['/auth/login']);
        } else {
          this.messageService.show('error', res.message || this.translateService.instant('auth.registrationFailed'));
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.show('error', err.error?.message || this.translateService.instant('common.somethingWentWrong'));
      }
    });
  }
}
