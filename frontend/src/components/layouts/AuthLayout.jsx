import React from 'react'
import UI_IMG from "../../assets/imag.jpeg"

const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
      {/* Left Section */}
      <div className='w-screen h-screen md:w-[60%] px-12 pt-8 pb-12'>
        <h2 className='text-4xl font-extrabold text-black'>Task Manager</h2>
        {children}
      </div>

      {/* Right Section */}
      <div className='hidden md:flex w-[40%] h-screen items-center justify-center bg-[#5f6fff] bg-cover bg-no-repeat bg-center overflow-hidden p-8'>
        <img src={UI_IMG} className='w-64 lg:w-[90%]' alt="UI Illustration" />
      </div>
    </div>
  )
}

export default AuthLayout
