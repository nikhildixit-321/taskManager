import React from "react";
import moment from "moment";
import { LuCalendar, LuPaperclip, LuCheck } from "react-icons/lu";


const TaskCard = ({
  title = "Untitled Task",
  description = "No description",
  priority = "Medium",
  status = "Pending",
  progress = 0,
  dueDate,
  assignedTo = [],
  attachmentCount = 0,
  completedTodoCount = 0,
  onClick,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl bg-white dark:bg-gray-800 p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-gray-600"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{title}</h3>

        <div className="flex gap-2 flex-shrink-0">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor()} dark:bg-opacity-20`}
          >
            {status}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor()} dark:bg-opacity-20`}
          >
            {priority}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-500 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer Icons */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {dueDate && (
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <LuCalendar size={14} className="text-blue-500" />
            <span>{moment(dueDate).format("MMM DD")}</span>
          </div>
        )}

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <LuPaperclip size={14} className="text-purple-500" />
            <span>{attachmentCount}</span>
          </div>
        )}

        {completedTodoCount > 0 && (
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <LuCheck size={14} className="text-green-500" />
            <span>{completedTodoCount}</span>
          </div>
        )}
      </div>

      {/* Assigned Users */}
      {assignedTo.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex -space-x-2">
            {assignedTo.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-semibold border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm"
              >
                {img ? (
                  <img
                    src={img}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "U"
                )}
              </div>
            ))}
          </div>

          {assignedTo.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              +{assignedTo.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
