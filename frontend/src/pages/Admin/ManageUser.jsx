import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { LuArrowUpWideNarrow, LuFileSpreadsheet } from 'react-icons/lu';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import UserCard from '../../components/Cards/UserCard';

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  // download task report
  const handleDownloadReport = async () => {
    // TODO: implement
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType:"blob",
      })
      //create a url for the blob
       const url = window.URL.createObjectURL(new Blob([response.data]))
       const link = document.createElement('a')
       link.href = url;
       link.setAttribute("download","user_details.xlsx");
       document.body.appendChild(link);
       link.clink();
       link.parentNode.removeChild(link);
       window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details",error);
      toast.error("Failed to download expense details. Please try again")
    
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Manager">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          <button
            className="flex md:flex download-btn items-center gap-2"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
