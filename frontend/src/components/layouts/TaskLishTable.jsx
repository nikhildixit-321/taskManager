import React from 'react';
import moment from 'moment';
import { LuArrowRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const TaskLishTable = ({ tableData = [] }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tableData || tableData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Title</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Status</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Due Date</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((task) => (
            <tr key={task._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <p className="font-medium text-sm">{task.title || 'Untitled'}</p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status || 'Pending'}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority || 'Medium'}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {task.dueDate ? moment(task.dueDate).format('MMM DD, YYYY') : 'N/A'}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate('/admin/create-task', { state: { taskId: task._id } })}
                  className="text-[#1368EC] hover:text-[#0d52b8] flex items-center gap-1 text-sm"
                >
                  View <LuArrowRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskLishTable;

