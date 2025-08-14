import React from 'react'
import { useUserAuth } from '../../hooks/userUserAuth'

const UserDeshboard = () => {
  useUserAuth()
  return (
    <div>
      UserDeshboard
    </div>
  )
}

export default UserDeshboard
