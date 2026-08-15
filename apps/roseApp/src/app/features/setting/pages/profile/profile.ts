import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputComponent, Button, DarkModeService } from "@org/ui";
import { SelectModule } from 'primeng/select';
import { ProfileStore } from '../../state/ProfileStore';
import {
  CheckoutDeleteModalComponent
} from "../../../checkout/pages/checkout/addresses/components/checkout-delete-modal/checkout-delete-modal.component";
import { ProfileModel } from '../../models/profile';
import { DataResponse } from '@org/data-access';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    TranslatePipe,
    SelectModule,
    CheckoutDeleteModalComponent,
    Button
  ],
  templateUrl: './profile.html'
})
export class Profile {
  readonly profileStore = inject(ProfileStore);
  private readonly fb = inject(FormBuilder);
  deletingAccount = signal<boolean>(false);
  private readonly darkModeService = inject(DarkModeService);
  readonly isDark = this.darkModeService.isDark;
  readonly isLoading = signal(false);
  isDeleteModalOpen = computed(() => this.deletingAccount() !== null);
  avatarUrl = signal<string>(
    'https://placehold.co/600x400'
  );
  selectedFile = signal<File | null>(null);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    gender: [{ value: '', disabled: true }],
  });

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  constructor() {
    effect(() => {
      const data = this.profileStore.profile;

      if (data()) {
        this.profileForm.patchValue({
          firstName: data()?.user.firstName,
          lastName: data()?.user.lastName || '',
          email: data()?.user.email,
          phone: data()?.user.phone || '',
          gender: data()?.user.gender,
        });

        if (data()?.user.photo) {
          this.avatarUrl.set(data()?.user.photo || '');
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.avatarUrl.set(reader.result as string);
      reader.readAsDataURL(file);


    }
  }

onSubmit(): void {
  if (!this.profileForm.valid) {
    this.isLoading.set(false);
    this.profileForm.markAllAsTouched();
    return;
  }

  this.isLoading.set(true);

  const submitProfile = () => {
    const payload = {
      firstName: this.profileForm.getRawValue().firstName,
      lastName: this.profileForm.getRawValue().lastName,
      phone: this.profileForm.getRawValue().phone,
      photo: this.avatarUrl(),
    };
    this.profileStore.updateProfile(payload as ProfileModel);
    this.isLoading.set(false);
  };

  const file = this.selectedFile();

  if (file) {
    const formData = new FormData();
    formData.append('image', file); 

    this.profileStore.uploadPhoto(formData).subscribe({
      next: (res) => {
       const data = res as unknown as DataResponse<{ url: string }>;
        this.avatarUrl.set(data.payload.url);
        submitProfile(); 
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  } else {
    submitProfile();
  }
}

  onDeleteAccount(): void {
    this.deletingAccount.set(true);

  }

  confirmDelete(): void {
    this.deletingAccount.set(true);
    this.profileStore.deleteProfile();
  }

  cancelDelete(): void {
    this.deletingAccount.set(false);
  }

}