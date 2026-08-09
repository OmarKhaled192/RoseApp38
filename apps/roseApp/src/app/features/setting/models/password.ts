import type { BaseResponse as PasswordResponse } from '@org/data-access';

export interface PasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type { PasswordResponse };
