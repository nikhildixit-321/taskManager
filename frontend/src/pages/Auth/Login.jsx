import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utills/helper'
import axiosInstance from '../../utills/axiosInstance'
import { API_PATHS } from '../../utills/apiPath'
import { UserContext } from '../../context/userContext'
const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null)
  const {updateUser} = useContext(UserContext)
  const navigate =useNavigate()
  // handle login form submit 
  const handleLogin = async (e)=>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address ")
      return;
    }
    if(!password){
      setError("Please enter the password")
      return
    }
    setError("")
    //login api call

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,password
      })
      const {token,role} = response.data;
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data)
        // redirect based on role
        if(role === "admin"){
          navigate("/admin/dashboard")
        }else{
          navigate("/user/dashboard")
        }
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("something went wrong please try again")
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg-:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
       <h3 className='text-xl font-semibold text-black'>welcome</h3>
       <p className='text-[15px] text-slate-700 mt-[5px] mb-6'>Please enter your details to log in</p>
       <form onSubmit={handleLogin}>
        <Input
         type="text"
         value={email}
        onChange={(e)=>setEmail(e.target.value)}
        lable ="Email Address"
        placeholder='example@gmail.com'
         />


        <Input 
        type="password"
         value={password}
        onChange={(e)=>setPassword(e.target.value)}
        lable ="Password Address"
        placeholder='Min 8 Character' />   


       {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
       <button type='submit' className='btn-primary'>Login</button>
       <p className='text-[13px] text-slate-800 mt-3'>
        Don't have an account ? {''}
        <Link className=' font-medium text-primary underline' to="/signup">SignUp</Link>
       </p>
       </form>
      </div>
    </AuthLayout>
  )
}

export default Login
