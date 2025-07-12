// src/components/Dropdown/Dropdown.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ title, instructor, basePath, resources }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative" style={{ width: '555px' }}>
      {/* Dropdown Button with exact dimensions */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-[20px] shadow-sm hover:shadow-md transition-all"
        style={{
          width: '555px',
          height: '100px',
          padding: '18px 16px'
        }}
        aria-expanded={isOpen}
      >
        <div className="text-left">
          <div className="text-lg font-medium text-gray-800 dark:text-white">
            {title}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {instructor}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-20 mt-1 w-full rounded-lg bg-white dark:bg-zinc-800 shadow-lg border border-gray-200 dark:border-zinc-700 animate-fade-in"
          style={{ width: '555px' }}
        >
          <div className="grid grid-cols-2 gap-1 p-2">
            {resources.map((resource) => (
              <Link
                key={resource}
                to={`${basePath}/${resource.toLowerCase()}`}
                onClick={closeDropdown}
                className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-md transition-colors text-center"
              >
                {resource}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;