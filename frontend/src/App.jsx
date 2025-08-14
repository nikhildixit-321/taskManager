// App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/auth/SignUp';
import Deshboard from './pages/Admin/Deshboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUser from './pages/Admin/ManageUser';
import UserDeshboard from './pages/User/UserDeshboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import PrivateRoutes from './routes/privateRoutes';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <UserProvider>
      <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Deshboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUser />} />
          </Route>

          {/* User Protected Routes */}
          <Route element={<PrivateRoutes allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDeshboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
      </div>
      <Toaster 
      toastOptions = {{
        className:"",
        style:{
          fontSize:"13px"
        },
      }}/>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin"
    ? <Navigate to="/admin/dashboard" />
    : <Navigate to="/user/dashboard" />;
};
