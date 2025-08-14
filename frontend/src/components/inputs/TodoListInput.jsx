import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState('');

  // Function to handle adding an option
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption('');
    }
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 hover:shadow-sm transition"
          key={index}
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>
          <button
            className="cursor-pointer p-1 rounded hover:bg-red-50"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-4">
        <input
          type="text"
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-200 py-2 px-3 rounded-md focus:ring-2 focus:ring-blue-300"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
        />
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

export default TodoListInput;
