import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import { LuPlus, LuPencil, LuTrash2, LuCopy } from 'react-icons/lu';
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
      <div className="my-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Task Templates</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1368EC] text-white px-4 py-2 rounded-lg hover:bg-[#0d52b8]"
          >
            <LuPlus /> Create Template
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div key={template._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg dark:text-white">{template.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCreateTask(template._id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Create task from template"
                    >
                      <LuCopy size={18} />
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
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <LuTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{template.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    template.priority === 'High' ? 'bg-red-100 text-red-800' :
                    template.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {template.priority}
                  </span>
                  {template.isPublic && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Public</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.todoChecklist?.length || 0} checklist items
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTemplate ? 'Edit Template' : 'Create Template'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Template Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              rows={3}
            />
          </div>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm dark:text-white">Make this template public</label>
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
              {editingTemplate ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Templates;
