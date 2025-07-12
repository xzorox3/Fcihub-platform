import React from 'react';
import { FiTrash2, FiUpload, FiEdit } from 'react-icons/fi';
// import { Tooltip } from 'react-tooltip'; // Optional: only if you want fancy tooltips

const ButtonAction = ({ onDelete, onUploadClick, onUpdateClick, disableUpdate }) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border dark:border-gray-700 z-50">
      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"
        aria-label="Delete"
      >
        <FiTrash2 size={20} />
      </button>

      {/* Upload */}
      <button
        onClick={onUploadClick}
        className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow transition"
        aria-label="Upload"
      >
        <FiUpload size={20} />
      </button>

      {/* Update */}
      <button
        onClick={onUpdateClick}
        disabled={disableUpdate}
        className={`p-3 rounded-full text-white shadow transition ${
          disableUpdate
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label="Update"
      >
        <FiEdit size={20} />
      </button>
    </div>
  );
};

export default ButtonAction;
