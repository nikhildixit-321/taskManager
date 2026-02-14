import React from 'react';

const DeleteAlert = ({ content, onDelete, onCancel }) => {
  return (
    <div>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;

