export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}


export interface RegisterResponse{
  user: User
  token: string
}

export interface User {
  id: string
  username: string
  email: string
  phone: any
  firstName: string
  lastName: string
  gender: string
  emailVerified: boolean
  phoneVerified: boolean
  role: string
}
