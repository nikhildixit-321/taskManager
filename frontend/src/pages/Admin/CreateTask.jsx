import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utills/data';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/inputs/SelectDropdown';
import SelectUsers from '../../components/inputs/SelectUsers';
import TodoListInput from '../../components/inputs/TodoListInput';
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput';
import moment from 'moment';
import Modal from '../../components/layouts/Modal';
import DeleteAlert from '../../components/layouts/DeleteAlert';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [],
    attachment: []
  });

  const [currentTask, setCurrentTask] = useState(null);

  const handleValueChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachment: []
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map(item => ({
        text: item,
        completed: false
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist
      });

      toast.success('Task Created Successfully');
      clearData();
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = taskData.todoChecklist.map(item => {
        const matched = currentTask?.todoChecklist?.find(t => t.text === item);
        return {
          text: item,
          completed: matched ? matched.completed : false
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist
      });

      toast.success('Task Updated Successfully');
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setError('');
    if (!taskData.title.trim()) return setError('Title is required');
    if (!taskData.description.trim()) return setError('Description is required');
    if (!taskData.dueDate) return setError('Due date is required');
    if (!taskData.assignedTo.length) return setError('Task not assigned to any member');
    if (!taskData.todoChecklist.length) return setError('Add at least one todo task');

    taskId ? updateTask() : createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const taskInfo = response.data;
      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format('YYYY-MM-DD') : '',
        assignedTo: taskInfo.assignedTo || [],
        todoChecklist: taskInfo.todoChecklist?.map(item => item.text) || [],
        attachment: taskInfo.attachment || []
      });
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success('Task deleted successfully');
      navigate('/admin/tasks');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return (
   <DashboardLayout  activeMenu={taskId ? 'Update Task' : 'Create Task'}>
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                {taskId ? 'Update Task' : 'Create Task'}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 rounded px-2 py-1 border border-rose-100 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-700"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Task Title</label>
              <input
                className="form-input"
                placeholder="Create APP UI"
                value={taskData.title}
                onChange={({ target }) => handleValueChange('title', target.value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Description</label>
              <textarea
                placeholder="Describe task"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => handleValueChange('description', target.value)}
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-4">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange('priority', value)}
                  placeholder="Select Priority"
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Due Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={taskData.dueDate}
                  onChange={({ target }) => handleValueChange('dueDate', target.value)}
                />
              </div>

              <div className="col-span-12 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">TODO Checklist</label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) => handleValueChange('todoChecklist', value)}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">Add Attachments</label>
              <AddAttachmentsInput
                attachment={taskData.attachment}
                setAttachment={(value) => handleValueChange('attachment', value)}
              />
            </div>

            {error && <p className="text-xs font-medium text-red-500 mt-5">{error}</p>}

            <div className="flex justify-end mt-7">
              <button className="add-btn" onClick={handleSubmit} disabled={loading}>
                {taskId ? 'UPDATE TASK' : 'CREATE TASK'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal 
      isOpen={openDeleteAlert}
      onClose={()=> setOpenDeleteAlert(false)}
      title="Delete Task">
        <DeleteAlert
         content="Are you sure you want to delete this task"
         onDelete={() => deleteTask()}
         onCancel={() => setOpenDeleteAlert(false)}/>
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;