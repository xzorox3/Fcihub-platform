import React, { useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const LeaderCard = ({ name = "Leader Name", career = "His Career", image }) => {
  const [profileImage, setProfileImage] = useState(image || "https://via.placeholder.com/150");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-[410px] h-[456px] bg-white dark:bg-gray-800 rounded-[16px] shadow-[0_6px_10px_rgba(44,87,140,0.25)] dark:shadow-[0_6px_10px_rgba(0,0,0,0.5)] flex flex-col items-center justify-start relative transition hover:scale-[1.02] duration-300 ease-in-out">
      {/* Profile Image Section */}
      <div className="relative mt-6">
        <img
          src={profileImage}
          alt="Leader"
          className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md dark:border-gray-700"
        />
        {/* Upload "+" Icon */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
          title="Upload Photo"
        >
          <FaPlus className="text-xs" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Text Info */}
      <div className="mt-6 text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{career}</p>
      </div>

      {/* Connect Button */}
      <button
        className="mt-auto mb-8 px-6 py-2 border border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 hover:text-white transition font-medium"
      >
        Connect
      </button>
    </div>
  );
};

export default LeaderCard;
