export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phonenumber: string;
    username: string;
}


export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phonenumber: string;
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    user: User | null;
    accountId: number | null;
    message: string;
}







