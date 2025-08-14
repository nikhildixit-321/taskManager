import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachment, setAttachment }) => {
  const [option, setOption] = useState('');

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachment([...attachment, option.trim()]);
      setOption('');
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = attachment.filter((_, idx) => idx !== index);
    setAttachment(updatedArr);
  };

  return (
    <div>
      {attachment.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 hover:shadow-sm transition"
        >
          <div className="flex-1 flex items-center gap-3">
            <LuPaperclip className="text-gray-400 flex-shrink-0" />
            <p className="text-xs text-black break-all">{item}</p>
          </div>
          <button
            className="cursor-pointer p-1 rounded hover:bg-red-50"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-300">
          <LuPaperclip className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white"
          />
        </div>
        <button
          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
