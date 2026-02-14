import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utills/axiosInstance";
import { API_PATHS } from "../../utills/apiPath";
import moment from "moment";
import { LuCalendar, LuPaperclip } from "react-icons/lu";
import {
  FaArrowLeft,
  FaUser,
  FaCheckSquare,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.TASKS.GET_TASK_BY_ID(id)
        );
        setTask(response.data);
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleChecklistToggle = async (index) => {
    if (!task) return;

    const updatedChecklist = task.todoChecklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    try {
      await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { todoChecklist: updatedChecklist }
      );
      setTask({ ...task, todoChecklist: updatedChecklist });
      toast.success("Checklist updated");
    } catch (error) {
      console.error("Error updating checklist:", error);
      toast.error("Failed to update checklist");
    }
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Task Details">
        <p className="text-center py-8 text-gray-500">
          Loading task details...
        </p>
      </DashboardLayout>
    );
  }

  if (!task) {
    return (
      <DashboardLayout activeMenu="Task Details">
        <div className="text-center py-8">
          <p className="text-gray-500">Task not found</p>
          <button
            onClick={() => navigate("/user/tasks")}
            className="mt-4 text-[#1368EC]"
          >
            Go back to tasks
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const completedCount =
    task.todoChecklist?.filter((i) => i.completed).length || 0;
  const totalCount = task.todoChecklist?.length || 0;
  const progress =
    totalCount > 0
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

  return (
    <DashboardLayout activeMenu="Task Details">
      <div className="my-5">
        <button
          onClick={() => navigate("/user/tasks")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          Back to Tasks
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold mb-4">{task.title}</h1>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 text-gray-600">
              <LuCalendar />
              <span>
                {task.dueDate
                  ? moment(task.dueDate).format("MMM DD, YYYY")
                  : "No due date"}
              </span>
            </div>

            {task.assignedTo?.length > 0 && (
              <div className="flex items-center gap-3 text-gray-600">
                <FaUser />
                <span>
                  {task.assignedTo.map((u) => u.name).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FaCheckSquare />
                Progress
              </h3>
              <span className="text-sm text-gray-500">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full">
              <div
                className="bg-[#1368EC] h-3 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {progress}% complete
            </p>
          </div>

          {/* Checklist */}
          {task.todoChecklist?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Todo Checklist</h3>
              {task.todoChecklist.map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(index)}
                  />
                  <span
                    className={
                      item.completed
                        ? "line-through text-gray-500"
                        : ""
                    }
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Attachments */}
          {task.attachments?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <LuPaperclip />
                Attachments
              </h3>
              {task.attachments.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-blue-600 mb-1"
                >
                  {url.split("/").pop()}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
