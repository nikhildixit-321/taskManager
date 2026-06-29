import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import { LuPlus, LuPencil, LuTrash2, LuPause, LuPlay, LuCalendarClock, LuUsers } from 'react-icons/lu';
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
      <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between bg-gray-800 items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Recurring Tasks</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and automate your routine workflows effortlessly.</p>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1368EC] to-[#0a45a3] text-black px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <LuPlus className="w-5 h-5" /> Create Routine
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1368EC]"></div>
          </div>
        ) : recurringTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <LuCalendarClock className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">No recurring tasks found</p>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Get started by creating your first automated routine to save time on repetitive tasks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recurringTasks.map((task) => (
              <div key={task._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-[#1368EC] transition-colors line-clamp-1">{task.title}</h3>
                    <p className="text-sm font-medium text-[#1368EC] dark:text-blue-400 mt-1">{getFrequencyLabel(task)}</p>
                  </div>
                  <div className="flex gap-1 -mr-2 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg">
                    <button
                      onClick={() => handleToggle(task._id)}
                      className={`p-1.5 rounded-md transition-colors ${task.isActive ? 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      title={task.isActive ? 'Active' : 'Paused'}
                    >
                      {task.isActive ? <LuPlay size={16} /> : <LuPause size={16} />}
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
                      className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-md transition-colors"
                      title="Edit"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-md transition-colors"
                      title="Delete"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {task.description || <span className="italic opacity-50">No description provided.</span>}
                </p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      task.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                      task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      task.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {task.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex flex-col gap-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <LuCalendarClock className="mr-1.5 w-4 h-4" />
                      <span>Next run: <span className="font-semibold text-gray-700 dark:text-gray-300">{moment(task.nextRunDate).format('MMM DD, YYYY')}</span></span>
                    </div>
                    {task.assignedTo?.length > 0 && (
                      <div className="flex items-start text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <LuUsers className="mr-1.5 w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-1" title={task.assignedTo.map(u => u.name).join(', ')}>
                          Assigned to: <span className="font-semibold text-gray-700 dark:text-gray-300">{task.assignedTo.map(u => u.name).join(', ')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTask ? 'Edit Recurring Task' : 'Create Recurring Task'}>
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[75vh] overflow-y-auto px-1 scrollbar-hide">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Task Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              placeholder="e.g., Weekly Team Meeting"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none resize-none"
              rows={3}
              placeholder="Describe the task requirements..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom Interval</option>
              </select>
            </div>
          </div>

          {formData.frequency === 'weekly' && (
            <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Repeat on days</label>
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.daysOfWeek.includes(idx)
                        ? 'bg-[#1368EC] text-white shadow-md'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {formData.frequency === 'monthly' && (
            <div className="space-y-1.5 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Day of the Month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.dayOfMonth}
                onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              />
            </div>
          )}

          {formData.frequency === 'custom' && (
            <div className="space-y-1.5 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Repeat every X days</label>
              <input
                type="number"
                min="1"
                value={formData.customInterval}
                onChange={(e) => setFormData({ ...formData, customInterval: parseInt(e.target.value) })}
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">End Date <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Assign to Team Members</label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50/50 dark:bg-gray-800/30">
              {users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((user) => (
                    <label key={user._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.assignedTo.includes(user._id)}
                          onChange={(e) => {
                            const newAssignees = e.target.checked
                              ? [...formData.assignedTo, user._id]
                              : formData.assignedTo.filter(id => id !== user._id);
                            setFormData({ ...formData, assignedTo: newAssignees });
                          }}
                          className="peer w-5 h-5 appearance-none border-2 border-gray-300 dark:border-gray-500 rounded-md checked:bg-[#1368EC] checked:border-[#1368EC] transition-all"
                        />
                        <svg className="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No team members available</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#1368EC] to-[#0a45a3] text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium"
            >
              {editingTask ? 'Save Changes' : 'Create Routine'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default RecurringTasks;

