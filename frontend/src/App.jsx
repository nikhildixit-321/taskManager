import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Deshboard from './pages/Admin/Deshboard'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUser from './pages/Admin/ManageUser'
import UserDeshboard from './pages/User/UserDeshboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import PrivateRoutes from './routes/privateRoutes'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
          <Route path='/admin/dashboard' element={<Deshboard />} />
          <Route path='/admin/tasks' element={<ManageTasks />} />
          <Route path='/admin/create-task' element={<CreateTask />} />
          <Route path='/admin/users' element={<ManageUser />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<PrivateRoutes allowedRoles={["user"]} />}>
          <Route path='/user/dashboard' element={<UserDeshboard />} />
          <Route path='/user/tasks' element={<MyTasks />} />
          <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
