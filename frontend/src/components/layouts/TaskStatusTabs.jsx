import React from 'react';

const TaskStatusTabs = ({ tabs = [], activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(tab.label)}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === tab.label
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          {tab.label} ({tab.count || 0})
        </button>
      ))}
    </div>
  );
};

export default TaskStatusTabs;

