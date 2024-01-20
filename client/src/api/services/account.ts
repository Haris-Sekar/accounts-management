import { IAuthForm, ILogin } from "../../models/IAuthForm";
import { API } from "../axios";
import { toast } from "react-toastify";

async function register(data: IAuthForm) {

    return toast.promise(API.post(`user/signup`, data), {
        pending: {
            render() {
                return `Creating your account!`
            }
        }, error: {
            render({data}) {
                return data.response.data.message;
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
                return data.response.data.message;
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
                return `Login success`
            }
        }
    })
}

export { register, login };