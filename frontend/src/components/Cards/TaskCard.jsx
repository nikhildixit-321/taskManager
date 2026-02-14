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
      className="cursor-pointer rounded-lg border bg-white p-4 hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {status}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}
          >
            {priority}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 rounded-full bg-[#1368EC]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer Icons */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {dueDate && (
          <div className="flex items-center gap-1">
            <LuCalendar size={14} />
            <span>{moment(dueDate).format("MMM DD")}</span>
          </div>
        )}

        {attachmentCount > 0 && (
          <div className="flex items-center gap-1">
            <LuPaperclip size={14} />
            <span>{attachmentCount}</span>
          </div>
        )}

        {completedTodoCount > 0 && (
          <div className="flex items-center gap-1">
            <LuCheck size={14} />
            <span>{completedTodoCount}</span>
          </div>
        )}
      </div>

      {/* Assigned Users */}
      {assignedTo.length > 0 && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          <div className="flex -space-x-2">
            {assignedTo.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-[#1368EC] text-white flex items-center justify-center text-xs font-semibold border-2 border-white overflow-hidden"
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
            <span className="text-xs text-gray-500">
              +{assignedTo.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
