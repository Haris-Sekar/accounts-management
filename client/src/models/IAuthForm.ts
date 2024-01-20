export interface IAuthForm {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface ILogin {
    email: string;
    password: string;
}