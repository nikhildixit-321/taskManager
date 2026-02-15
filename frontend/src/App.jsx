// App.jsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import GoogleAuthCallback from './pages/Auth/GoogleAuthCallback';
import Deshboard from './pages/Admin/Deshboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUser from './pages/Admin/ManageUser';
import Templates from './pages/Admin/Templates';
import RecurringTasks from './pages/Admin/RecurringTasks';
import UserDeshboard from './pages/User/UserDeshboard';
import MyTasks from './pages/User/MyTasks';
import ViewTaskDetails from './pages/User/ViewTaskDetails';
import PrivateRoutes from './routes/privateRoutes';
import UserProvider, { UserContext } from './context/userContext';
import ThemeProvider from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

// Root component
const Root = () => {
  const { user, loading } = useContext(UserContext);
  const location = window.location.pathname;

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin" && !location.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === "member" && !location.startsWith("/user")) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return null;
};

const App = () => {
  return (
    <ThemeProvider>
    <UserProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />

        {/* Admin Protected Routes */}
        <Route element={<PrivateRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Deshboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUser />} />
          <Route path="/admin/templates" element={<Templates />} />
          <Route path="/admin/recurring-tasks" element={<RecurringTasks />} />
        </Route>

        {/* User Protected Routes */}
        <Route element={<PrivateRoutes allowedRoles={["member"]} />}>
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
    </ThemeProvider>
  );
};

export default App;
