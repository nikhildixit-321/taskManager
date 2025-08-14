import React, { useEffect, useState } from "react";
import axiosInstance from "../../utills/axiosInstance";
import { API_PATHS } from "../../utills/apiPath";
import Modal from "../layouts/Modal";
import { LuUsers } from "react-icons/lu";
import AvatarGroup from "../layouts/AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {/* Button to open modal */}
      {selectedUserAvatars.length === 0 ? (
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <LuUsers className="text-lg" /> Add Members
        </button>
      ) : (
        <div className="flex items-center gap-2">
          {selectedUserAvatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-300"
            />
          ))}
          <button
            className="ml-2 text-sm text-blue-600 hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </button>
        </div>
      )}
      {selectedUserAvatars.length === 0  && (
        <button className="" onClick={()=> setIsModalOpen(true)}>
            <LuUsers className="text-sm"/>Add Members
        </button>
      )}
      {selectedUserAvatars.length >0 && (
        <div className="cursor-pointer" onClick={()=>setIsModalOpen(true)}>
            <AvatarGroup avatar={selectedUserAvatars} maxVisible={3}/>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onclose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-gray-100 transition"
            >
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-full border"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 accent-blue-600"
              />
            </div>
          ))}
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="card-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="card-btn-fill"
          >
            Assign
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
