import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const profileImageUrl = searchParams.get('profileImageUrl');

    if (token && userId) {
      const userData = {
        _id: userId,
        name: decodeURIComponent(name || ''),
        email: decodeURIComponent(email || ''),
        role,
        profileImageUrl: profileImageUrl ? decodeURIComponent(profileImageUrl) : null,
        token
      };

      updateUser(userData);
      toast.success('Login successful!');

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } else {
      toast.error('Authentication failed');
      navigate('/login', { replace: true });
    }
  }, []); // Empty dependency array - run only once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1368EC] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
