import { AxiosError } from "axios";
import { IAuthForm, ILogin, IResponseData } from "../../models/IAuthForm";
import { API, unauthorizedAccess } from "../axios";
import { toast } from "react-toastify";

async function register(data: IAuthForm) {

    return toast.promise(API.post(`user/signup`, data), {
        pending: {
            render() {
                return `Creating your account!`
            }
        }, error: {
            render({data}) {
                const axioserror = data as AxiosError;
                const reqError = axioserror.response?.data as IResponseData; 
                unauthorizedAccess(reqError);
                return reqError.message;
            }
        }, success: {
            render() {
                return `Your account has been created!`
            }
        }
    })
}

async function login(data: ILogin) {
    return toast.promise(API.post(`user/login`, data), {
        error: {
            render({data}) {
                const axioserror = data as AxiosError;
                const reqError = axioserror.response?.data as IResponseData; 
                unauthorizedAccess(reqError);
                return reqError.message;
            }
        },
        pending: {
            render() {
                return `Loging you in`
            }
        },
        success: {
            render({data}) {
                const resp = data?.data;
                localStorage.setItem(`user_details`, JSON.stringify(resp.user_details));
                localStorage.setItem(`token`, resp.jwt_token);
                localStorage.setItem(`company_details`, JSON.stringify(resp.company_details))
                return `Login success`
            }
        }
    })
}

export { register, login };