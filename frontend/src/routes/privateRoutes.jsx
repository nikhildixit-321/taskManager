import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const PrivateRoutes = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <Outlet />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default PrivateRoutes
