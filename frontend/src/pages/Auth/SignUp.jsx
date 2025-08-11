import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utills/helper'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import Input from '../../components/inputs/Input'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utills/axiosInstance'
import { API_PATHS } from '../../utills/apiPath'
import { UserContext } from '../../context/userContext'
import uploadImage from '../../utills/uploadImage'

const SignUp = () => {
  const [profilePic,setProfilePic] = useState(null)
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [adminInviteToken,setAdminInviteToken] = useState('')
  const [error,setError] = useState(null)
  const {updateUser} = useContext(UserContext)
  const navigate =useNavigate()
  // handle signup form submit
    const handleSignUp = async (e)=>{
      e.preventDefault();

      let  profileImageUrl = ''

       if(!fullName){
        setError("Please enter a valid name address ")
        return;
      }
      if(!validateEmail(email)){
        setError("Please enter a valid email address ")
        return;
      }
      if(!password){
        setError("Please enter the password")
        return
      }
      setError("")
      // signup api call
      try {
        // UPLOAD image if present 
        if(profilePic){
        const imaUploadRes = await uploadImage(profilePic)
          profileImageUrl = imaUploadRes.imageUrl || ""
        }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken
      })
      const {token,role} = response.data;
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data);
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
    <div className='lg:w-[100%]  h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
      <h3 className="text-xl font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">Join us today by entering your details below</p>
      <form className='' action="" onSubmit={handleSignUp}>
        <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic}/>
        <div className='md:grid-cols gap-4'>

        <Input type="text"
        value={fullName}
        onChange={({target})=>setFullName(target.value)}
        label="Full Name"
        placeholder='full name'
        
        />
         <Input type="email"
        value={email}
        onChange={({target})=>setEmail(target.value)}
        label="Email"
        placeholder='example@gmail.com'
        
        />
         <Input type="password"
        value={password}
        onChange={({target})=>setPassword(target.value)}
        label="Password"
        placeholder='password'
        
        />
      <Input type="text"
        value={adminInviteToken}
        onChange={({target})=>setAdminInviteToken(target.value)}
        label="Admin Invite Token"
        placeholder='6 Digit Code'
        
        />
      {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
       <button type='submit' className='btn-primary'>Sign UP</button>
       <p className='text-[13px] text-slate-800 mt-3'>
         have an account ? {''}
        <Link className=' font-medium text-primary underline' to="/signup">Login</Link>
       </p>


        </div>
      </form>
    </div>
    </AuthLayout>
  )
}

export default SignUp
