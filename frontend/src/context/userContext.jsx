import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utills/axiosInstance';
import { API_PATHS } from '../utills/apiPath';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // #region agent log
  const logDebug = (location, message, data) => {
    fetch('http://127.0.0.1:7242/ingest/a7a2be90-4c90-42f4-a997-46758b5bf88d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location,message,data,timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'H'})}).catch(()=>{});
  };
  logDebug('userContext.jsx:7', 'UserProvider initializing', {});
  // #endregion agent log
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    setLoading(false);
  };

  const fetchUser = async () => {
    // #region agent log
    logDebug('userContext.jsx:20', 'fetchUser called', {});
    // #endregion agent log
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      // #region agent log
      logDebug('userContext.jsx:24', 'No token found', {});
      // #endregion agent log
      setLoading(false);
      return;
    }
    try {
      // #region agent log
      logDebug('userContext.jsx:29', 'Fetching profile', { hasToken: !!accessToken });
      // #endregion agent log
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      // #region agent log
      logDebug('userContext.jsx:32', 'Profile response received', { hasData: !!response.data, userRole: response.data?.role || response.data?.data?.role });
      // #endregion agent log
      // Adjust based on backend structure
      setUser(response.data?.data || response.data);
    } catch (error) {
      // #region agent log
      logDebug('userContext.jsx:37', 'Profile fetch error', { errorMessage: error.message, errorStatus: error.response?.status });
      // #endregion agent log
      console.error("User not authenticated", error);
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // #region agent log
    logDebug('userContext.jsx:47', 'useEffect triggered, calling fetchUser', {});
    // #endregion agent log
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
