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