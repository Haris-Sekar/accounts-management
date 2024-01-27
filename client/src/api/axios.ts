import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: `${baseURL}/api/v1/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});


API.interceptors.request.use(
    async (response) => {
        const token = localStorage.getItem('token');
        if (token) {
            response.headers.Authorization = `Bearer ${token}`
        }
        return response;
    },
    (err) => {
        return Promise.reject(err);
    }
);

const unauthorizedAccess = (res: { code: number; }) => {
    console.log(res);
    
    if (res.code === 401) {
        localStorage.clear()
        location.replace('/auth');
    }
}

export { API, unauthorizedAccess };