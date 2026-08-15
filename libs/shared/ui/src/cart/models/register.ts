import { LoadingState } from "@org/data-access";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}


export interface RegisterResponse extends LoadingState{
  user: User | null
  token: string
}

export interface User {
  id: string
  username: string
  email: string
  phone: string
  firstName: string
  lastName: string
  gender: string
  emailVerified: boolean
  phoneVerified: boolean
  role: string
  photo:string;
}
