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
            // redirect to loginn page
            window.location.href = '/login'
        }else if(error.message.status === 500){
            console.error("server error, Please try again later")
        }
        else if(error.code === "ECONNABORTED"){
            console.error("Request timeout please try agein")

        }
        return Promise.reject(error)
    }
)
export default axiosInstance