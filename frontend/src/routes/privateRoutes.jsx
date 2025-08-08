import React from 'react'
import { Outlet } from 'react-router-dom'

const privateRoutes = (allowedRoles) => {
  return  <Outlet/>
}

export default privateRoutes
