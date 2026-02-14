import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import { useContext, useEffect } from "react";

export const useUserAuth = ()=>{
    const {user,loading,clearUser} = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(()=>{
        if(loading) return;
        if(user) return;
        if(!user){
            clearUser();
            navigate("/")
        }
    },[user,loading,clearUser,navigate])
}