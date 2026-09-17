import type { User } from '@org/ui';
export interface AccountPayload {
  user: User;
}
export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
  phone: string;
  photo: string;
}
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
