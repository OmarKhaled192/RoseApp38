import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    QuestionRepeatComponent
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

  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);

  readonly registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      const errors = form.get('confirmPassword')?.errors;
      if (errors) {
        delete errors['mismatch'];
        Object.keys(errors).length === 0
          ? form.get('confirmPassword')?.setErrors(null)
          : form.get('confirmPassword')?.setErrors(errors);
      }
    }
  }

  getError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control?.touched) return '';
    if (control?.errors?.['required']) return `${field} is required`;
    if (control?.errors?.['minlength']) return 'Password must be at least 8 characters';
    if (control?.errors?.['mismatch']) return 'Passwords do not match';
    return '';
  }

  get emailError(): string {
    const control = this.registerForm.get('email');
    if (!control?.touched) return '';
    if (control?.errors?.['required']) return 'Email is required';
    if (control?.errors?.['email']) return 'Please enter a valid email';
    if (control?.value && control.value !== this.registrationState.email()) {
      return 'Email does not match the one used for verification';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const enteredEmail = this.registerForm.value.email;
    if (enteredEmail !== this.registrationState.email()) {
      this.messageService.show('error', 'Email does not match the one used for verification');
      return;
    }

    this.isLoading.set(true);
    this.authApiService.register({
      ...this.registerForm.value,
    }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.status) {
          this.registrationState.clear();
          this.messageService.show('success', res.message || 'Account created successfully!');
          this.router.navigate(['../login']);
        } else {
          this.messageService.show('error', res.message || 'Registration failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.show('error', err.error?.message || 'Something went wrong. Please try again.');
      }
    });
  }
}
