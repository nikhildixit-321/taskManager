import React, { useState } from 'react'
import SideMenu from './SideMenu'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard') // default menu

  return (
    <div className='flex gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-3'>
      <button
        className='block lg:hidden text-black'
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>
      <h2 className='text-lg font-medium text-black'>Task Manager</h2>
      {openSideMenu && (
        <div className='fixed top-[61px] -ml-5 bg-white'>
          <SideMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>
      )}
    </div>
  )
}

export default Navbar
