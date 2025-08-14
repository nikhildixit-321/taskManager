import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utills/data';

const SideMenu = () => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // to detect current route

  const handleClick = (route) => {
    if (route === 'logout') {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
    }
  }, [user]);

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl || '/default-avatar.png'} // fallback image
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover"
          />
        </div>
        {user?.role === 'admin' && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            Admin
          </div>
        )}
        <h5 className="text-gray-950 font-medium leading-6 mt-3">{user?.name || ''}</h5>
        <p className="text-[12px] text-gray-500">{user?.email || ''}</p>
      </div>

      {/* Menu Items */}
      {sideMenuData.map((item, index) => {
        const isActive = location.pathname === item.path; // match current route
        return (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer transition-all duration-150
              ${
                isActive
                  ? 'text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SideMenu;
