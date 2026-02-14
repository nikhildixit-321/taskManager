import React from 'react';

const TaskStatusTabs = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6 border-b overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(tab.label)}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.label
              ? 'border-[#1368EC] text-[#1368EC]'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }`}
        >
          {tab.label} ({tab.count || 0})
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;

