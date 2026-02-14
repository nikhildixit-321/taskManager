import React, { useState } from 'react';
import { LuPlus, LuX } from 'react-icons/lu';

const TodoListInput = ({ todoList = [], setTodoList }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !todoList.includes(inputValue.trim())) {
      setTodoList([...todoList, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add todo item..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="form-input flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-[#1368EC] text-white rounded hover:bg-[#0d52b8]"
        >
          <LuPlus size={20} />
        </button>
      </div>

      {todoList.length > 0 && (
        <div className="mt-3 space-y-2">
          {todoList.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <span className="text-sm">{item}</span>
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

export default TodoListInput;

