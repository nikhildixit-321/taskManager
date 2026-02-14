import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LuSun, LuMoon } from 'react-icons/lu';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <LuMoon size={20} />
      ) : (
        <LuSun size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;
