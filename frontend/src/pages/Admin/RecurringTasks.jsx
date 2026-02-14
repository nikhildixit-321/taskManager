import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import { LuPlus, LuPencil, LuTrash2, LuPause, LuPlay } from 'react-icons/lu';
import toast from 'react-hot-toast';
import Modal from '../../components/layouts/Modal';
import moment from 'moment';

const RecurringTasks = () => {
  const [recurringTasks, setRecurringTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: [],
    frequency: 'daily',
    daysOfWeek: [],
    dayOfMonth: 1,
    customInterval: 7,
    startDate: moment().format('YYYY-MM-DD'),
    endDate: '',
    todoChecklist: []
  });

  const fetchRecurringTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RECURRING_TASKS.GET_ALL);
      setRecurringTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch recurring tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchRecurringTasks();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        nextRunDate: new Date(formData.startDate).toISOString()
      };

      if (editingTask) {
        await axiosInstance.put(API_PATHS.RECURRING_TASKS.UPDATE(editingTask._id), payload);
        toast.success('Recurring task updated successfully');
      } else {
        await axiosInstance.post(API_PATHS.RECURRING_TASKS.CREATE, payload);
        toast.success('Recurring task created successfully');
      }
      setShowModal(false);
      setEditingTask(null);
      resetForm();
      fetchRecurringTasks();
    } catch (error) {
      toast.error('Failed to save recurring task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      assignedTo: [],
      frequency: 'daily',
      daysOfWeek: [],
      dayOfMonth: 1,
      customInterval: 7,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: '',
      todoChecklist: []
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recurring task?')) return;
    try {
      await axiosInstance.delete(API_PATHS.RECURRING_TASKS.DELETE(id));
      toast.success('Recurring task deleted successfully');
      fetchRecurringTasks();
    } catch (error) {
      toast.error('Failed to delete recurring task');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axiosInstance.patch(API_PATHS.RECURRING_TASKS.TOGGLE(id));
      toast.success('Status updated');
      fetchRecurringTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getFrequencyLabel = (task) => {
    switch (task.frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        const days = task.daysOfWeek?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ');
        return `Weekly (${days || 'N/A'})`;
      case 'monthly':
        return `Monthly (Day ${task.dayOfMonth})`;
      case 'custom':
        return `Every ${task.customInterval} days`;
      default:
        return task.frequency;
    }
  };

  return (
    <DashboardLayout activeMenu="Recurring Tasks">
      <div className="my-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Recurring Tasks</h2>
          <button
            onClick={() => {
              setEditingTask(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1368EC] text-white px-4 py-2 rounded-lg hover:bg-[#0d52b8]"
          >
            <LuPlus /> Create Recurring Task
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : recurringTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No recurring tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringTasks.map((task) => (
              <div key={task._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{getFrequencyLabel(task)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(task._id)}
                      className={`p-1 rounded ${task.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={task.isActive ? 'Active' : 'Paused'}
                    >
                      {task.isActive ? <LuPlay size={18} /> : <LuPause size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setFormData({
                          title: task.title,
                          description: task.description,
                          priority: task.priority,
                          assignedTo: task.assignedTo?.map(u => u._id) || [],
                          frequency: task.frequency,
                          daysOfWeek: task.daysOfWeek || [],
                          dayOfMonth: task.dayOfMonth || 1,
                          customInterval: task.customInterval || 7,
                          startDate: moment(task.startDate).format('YYYY-MM-DD'),
                          endDate: task.endDate ? moment(task.endDate).format('YYYY-MM-DD') : '',
                          todoChecklist: task.todoChecklist || []
                        });
                        setShowModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{task.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Next run: {moment(task.nextRunDate).format('MMM DD, YYYY')}
                </p>
                {task.assignedTo?.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Assigned to: {task.assignedTo.map(u => u.name).join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTask ? 'Edit Recurring Task' : 'Create Recurring Task'}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="form-input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="form-input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {formData.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-white">Days of Week</label>
              <div className="flex gap-2 flex-wrap">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const newDays = formData.daysOfWeek.includes(idx)
                        ? formData.daysOfWeek.filter(d => d !== idx)
                        : [...formData.daysOfWeek, idx];
                      setFormData({ ...formData, daysOfWeek: newDays });
                    }}
                    className={`px-3 py-1 rounded text-sm ${
                      formData.daysOfWeek.includes(idx)
                        ? 'bg-[#1368EC] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                className="form-input"
              />
            </div>
          )}

          {formData.frequency === 'custom' && (
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Interval (days)</label>
              <input
                type="number"
                min="1"
                value={formData.customInterval}
                onChange={(e) => setFormData({ ...formData, customInterval: parseInt(e.target.value) })}
                className="form-input"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-white">Assign To</label>
            <div className="max-h-32 overflow-y-auto border dark:border-gray-600 rounded-lg p-2">
              {users.map((user) => (
                <label key={user._id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(user._id)}
                    onChange={(e) => {
                      const newAssignees = e.target.checked
                        ? [...formData.assignedTo, user._id]
                        : formData.assignedTo.filter(id => id !== user._id);
                      setFormData({ ...formData, assignedTo: newAssignees });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm dark:text-white">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:text-white dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1368EC] text-white rounded-lg hover:bg-[#0d52b8]"
            >
              {editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default RecurringTasks;
