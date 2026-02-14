import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import { LuX } from 'react-icons/lu';

const SelectUsers = ({ selectedUsers = [], setSelectedUsers }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
        // Backend returns array directly, not wrapped in users property
        setUsers(Array.isArray(response.data) ? response.data : response.data?.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      !selectedUsers.includes(user._id) &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const getSelectedUserNames = () => {
    return selectedUsers
      .map((id) => {
        const user = users.find((u) => u._id === id);
        return user?.name || 'Unknown';
      })
      .join(', ');
  };

  return (
    <div className="relative">
      <div
        className="form-input min-h-[42px] flex flex-wrap items-center gap-2 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        {selectedUsers.length > 0 ? (
          <>
            {selectedUsers.slice(0, 2).map((userId) => {
              const user = users.find((u) => u._id === userId);
              return (
                <span
                  key={userId}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#1368EC] text-white rounded text-xs"
                >
                  {user?.name || 'User'}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveUser(userId);
                    }}
                    className="hover:bg-[#0d52b8] rounded"
                  >
                    <LuX size={14} />
                  </button>
                </span>
              );
            })}
            {selectedUsers.length > 2 && (
              <span className="text-xs text-gray-500">+{selectedUsers.length - 2} more</span>
            )}
          </>
        ) : (
          <span className="text-gray-400">Select users...</span>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-48 overflow-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleSelectUser(user._id)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1368EC] flex items-center justify-center text-white text-xs font-semibold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectUsers;

