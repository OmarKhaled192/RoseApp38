import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Button } from '@org/ui';
import { AdminAccountStore } from '../../state/account.store';

@Component({
  selector: 'app-admin-profile',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    InputTextModule,
    DialogModule,
    ButtonModule,
    Button,
  ],
  templateUrl: './profile.html',
  host: {
    class:
      'block mx-auto w-full max-w-[1240px] text-zinc-800 dark:text-zinc-100',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfile {
  readonly store = inject(AdminAccountStore);
  private readonly fb = inject(FormBuilder);
  readonly deletingAccount = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly preview = signal('');
  readonly fileError = signal(false);
  readonly imageFailed = signal(false);
  readonly avatarUrl = computed(
    () => this.preview() || this.store.user()?.photo || '',
  );
  readonly initials = computed(() =>
    (
      (this.store.user()?.firstName?.[0] ?? '') +
      (this.store.user()?.lastName?.[0] ?? '')
    ).toUpperCase(),
  );
  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/)]],
    email: [{ value: '', disabled: true }],
    phone: [''],
    gender: [{ value: '', disabled: true }],
  });
  constructor() {
    effect(() => {
      const user = this.store.user();
      if (user)
        this.form.patchValue({
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email: user.email ?? '',
          phone: user.phone ?? '',
          gender: user.gender ?? '',
        });
    });
    effect(() => {
      this.avatarUrl();
      this.imageFailed.set(false);
    });
    effect(() => {
      if (this.store.savedVersion()) {
        this.selectedFile.set(null);
        this.preview.set('');
        this.form.markAsPristine();
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';
    const valid =
      ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) &&
      file.size <= 5 * 1024 * 1024;
    this.fileError.set(!valid);
    if (!valid) return;
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (this.selectedFile() === file) this.preview.set(String(reader.result));
    };
    reader.readAsDataURL(file);
  }
  save(): void {
    if (
      this.form.invalid ||
      this.store.isSaving() ||
      this.store.isDeleting() ||
      !this.store.hasProfile()
    ) {
      this.form.markAllAsTouched();
      return;
    }
    const { firstName, lastName, phone } = this.form.getRawValue();
    this.store.save({
      profile: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        photo: this.store.user()?.photo ?? '',
      },
      file: this.selectedFile(),
    });
  }
}
