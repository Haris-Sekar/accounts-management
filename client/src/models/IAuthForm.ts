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


export interface IResponseData {
    code: number;
    message: string;
    jwt_token: string;
    companies: string;
}