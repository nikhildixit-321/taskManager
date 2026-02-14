import axios from 'axios'
import { BASE_URL } from './apiPath'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})
// Request Interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem('token')
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
    return Promise.reject(error)
    }
    
)
// response interceptor
axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response){
            const status = error.response.status;
            // Only redirect on 401 (Unauthorized) or 403 (Forbidden) errors
            if(status === 401 || status === 403){
                // redirect to login page
                window.location.href = '/login'
            } else if(status === 500){
                console.error("server error, Please try again later")
            }
        }else if(error.code === "ECONNABORTED"){
            console.error("Request timeout please try again")
        }
        return Promise.reject(error)
    }
)
export default axiosInstance