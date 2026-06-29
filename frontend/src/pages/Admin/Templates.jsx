import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import { LuPlus, LuPencil, LuTrash2, LuCopy, LuLayoutTemplate, LuListTodo, LuGlobe } from 'react-icons/lu';
import toast from 'react-hot-toast';
import Modal from '../../components/layouts/Modal';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    isPublic: false,
    todoChecklist: []
  });

  const fetchTemplates = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TEMPLATES.GET_ALL);
      setTemplates(response.data);
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await axiosInstance.put(API_PATHS.TEMPLATES.UPDATE(editingTemplate._id), formData);
        toast.success('Template updated successfully');
      } else {
        await axiosInstance.post(API_PATHS.TEMPLATES.CREATE, formData);
        toast.success('Template created successfully');
      }
      setShowModal(false);
      setEditingTemplate(null);
      setFormData({ name: '', description: '', priority: 'Medium', isPublic: false, todoChecklist: [] });
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await axiosInstance.delete(API_PATHS.TEMPLATES.DELETE(id));
      toast.success('Template deleted successfully');
      fetchTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const handleCreateTask = async (templateId) => {
    try {
      await axiosInstance.post(API_PATHS.TEMPLATES.CREATE_TASK(templateId), {
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      toast.success('Task created from template');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <DashboardLayout activeMenu="Templates">
      <div className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between bg-neutral-700 items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Task Templates</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Standardize your work with reusable task blueprints.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#1368EC] to-[#0a45a3] text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-medium"
          >
            <LuPlus className="w-5 h-5" /> Create Template
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1368EC]"></div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <LuLayoutTemplate className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">No templates found</p>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Create a template to quickly spawn similar tasks in the future without starting from scratch.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-[#1368EC] transition-colors line-clamp-1">{template.name}</h3>
                  </div>
                  <div className="flex gap-1 -mr-2 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg shrink-0">
                    <button
                      onClick={() => handleCreateTask(template._id)}
                      className="p-1.5 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-md transition-colors"
                      title="Create task from template"
                    >
                      <LuCopy size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTemplate(template);
                        setFormData({
                          name: template.name,
                          description: template.description,
                          priority: template.priority,
                          isPublic: template.isPublic,
                          todoChecklist: template.todoChecklist
                        });
                        setShowModal(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-md transition-colors"
                      title="Edit"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-md transition-colors"
                      title="Delete"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                  {template.description || <span className="italic opacity-50">No description provided.</span>}
                </p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      template.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                      template.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    }`}>
                      {template.priority}
                    </span>
                    {template.isPublic && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 rounded-full text-xs font-bold tracking-wide uppercase">
                        <LuGlobe className="w-3 h-3" /> Public
                      </span>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <LuListTodo className="mr-1.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span>{template.todoChecklist?.length || 0} checklist item{(template.todoChecklist?.length !== 1) ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTemplate ? 'Edit Template' : 'Create Template'}>
        <form onSubmit={handleSubmit} className="space-y-5 px-1 pb-1">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1368EC] focus:border-transparent transition-all outline-none"
              placeholder="e.g., Onboarding Checklist"
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
              placeholder="Describe what this template is for..."
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Default Priority</label>
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
          
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="peer w-5 h-5 appearance-none border-2 border-gray-300 dark:border-gray-500 rounded-md checked:bg-[#1368EC] checked:border-[#1368EC] transition-all"
                />
                <svg className="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#1368EC] transition-colors">Make this template public</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Allow other team members to see and use this template</span>
              </div>
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
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
              {editingTemplate ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Templates;
