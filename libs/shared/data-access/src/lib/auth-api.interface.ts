export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}

export interface SendEmailVerificationRequest {
  email: string;
}

export interface ConfirmEmailVerificationRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status: boolean;
  code: number;
  message: string;
  payload: string;
}
