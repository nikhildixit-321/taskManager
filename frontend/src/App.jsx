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

// #region agent log
const logDebug = (location, message, data) => {
  fetch('http://127.0.0.1:7242/ingest/a7a2be90-4c90-42f4-a997-46758b5bf88d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H'})}).catch(()=>{});
};
// #endregion agent log

// Move Root component before App component
const Root = () => {
  // #region agent log
  try {
    logDebug('App.jsx:18', 'Root component rendering', {});
  } catch (e) {
    console.error('Error in Root log:', e);
  }
  // #endregion agent log
  try {
    const { user, loading } = useContext(UserContext);
    const location = window.location.pathname;

    // #region agent log
    logDebug('App.jsx:25', 'Root state', { loading, hasUser: !!user, userRole: user?.role, location });
    // #endregion agent log

    if (loading) {
      return null; // Return null instead of Outlet during loading
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // Only redirect if not already on the correct page
    if (user.role === "admin" && !location.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === "member" && !location.startsWith("/user")) {
      return <Navigate to="/user/dashboard" replace />;
    }

    return null; // Already on correct page, don't redirect
  } catch (error) {
    // #region agent log
    logDebug('App.jsx:45', 'ERROR in Root component', { errorMessage: error.message, errorStack: error.stack });
    // #endregion agent log
    console.error('Error in Root component:', error);
    return <Navigate to="/login" replace />;
  }
};

const App = () => {
  // #region agent log
  try {
    logDebug('App.jsx:47', 'App component rendering', {});
  } catch (e) {
    console.error('Error in App log:', e);
  }
  // #endregion agent log
  try {
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
  } catch (error) {
    // #region agent log
    logDebug('App.jsx:85', 'FATAL ERROR in App component', { errorMessage: error.message, errorStack: error.stack });
    // #endregion agent log
    console.error('Fatal error in App:', error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Application Error</h1>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }
};

export default App;
