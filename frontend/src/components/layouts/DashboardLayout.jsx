import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import SideMenu from './SideMenu';
import Navbar from './Navbar';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          {/* Sidebar */}
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          
          {/* Main content */}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
