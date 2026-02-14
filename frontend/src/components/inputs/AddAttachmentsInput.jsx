import React, { useState } from 'react';
import { LuUpload, LuX, LuFile } from 'react-icons/lu';
import axiosInstance from '../../utills/axiosInstance';
import { API_PATHS } from '../../utills/apiPath';
import toast from 'react-hot-toast';

const AddAttachmentsInput = ({ attachment = [], setAttachment }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data?.imageUrl || response.data?.data?.imageUrl || response.data;
      if (imageUrl) {
        setAttachment([...attachment, imageUrl]);
        toast.success('File uploaded successfully');
      } else {
        toast.error('Failed to get image URL from response');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    setAttachment(attachment.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            <LuUpload size={18} />
            <span className="text-sm">{uploading ? 'Uploading...' : 'Upload File'}</span>
          </div>
        </label>
      </div>

      {attachment.length > 0 && (
        <div className="mt-3 space-y-2">
          {attachment.map((url, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center gap-2">
                <LuFile size={18} className="text-gray-500" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate max-w-xs"
                >
                  {url.split('/').pop() || `Attachment ${index + 1}`}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <LuX size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddAttachmentsInput;

