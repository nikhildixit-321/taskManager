import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile)=>{
    const formData = new FormData();
    // append image File to form data
    formData.append('image',imageFile);
    try {
        const response = await axiosInstance.post(API_PATHS.UPLOAD_ILMAG,formData,{
            headers:{
                'Content-Type':'multipart/from-data'
            }
        })
        return response.data; 
    } catch (error) {
        console.error('error uploading the image',error);
        throw error;
    }
}
export default uploadImage;