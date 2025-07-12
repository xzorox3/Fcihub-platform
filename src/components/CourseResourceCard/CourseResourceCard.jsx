// src/components/CourseResourceCard/CourseResourceCard.jsx
import React from 'react';

function CourseResourceCard({ title, subtitle, color, onBook, onPdf, onVideos, onExams }) {
  return (
    <div className={`w-full h-[217px] bg-gradient-to-br ${color} dark:bg-gray-800 rounded-[20px] border border-black/70 dark:border-gray-600 p-6 shadow-md`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white dark:text-white">{title}</h2>
        <p className="text-white/90 dark:text-gray-300 mt-1">{subtitle}</p>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBook}
          className="flex flex-col items-center justify-center w-24 h-24 bg-white/20 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="bg-white dark:bg-gray-300 w-12 h-12 rounded-full mb-2 flex items-center justify-center">
            <span className="text-black font-bold">B</span>
          </div>
          <span className="text-white font-medium">Book</span>
        </button>
        
        <button 
          onClick={onPdf}
          className="flex flex-col items-center justify-center w-24 h-24 bg-white/20 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="bg-white dark:bg-gray-300 w-12 h-12 rounded-full mb-2 flex items-center justify-center">
            <span className="text-black font-bold">P</span>
          </div>
          <span className="text-white font-medium">PDF</span>
        </button>
        
        <button 
          onClick={onVideos}
          className="flex flex-col items-center justify-center w-24 h-24 bg-white/20 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="bg-white dark:bg-gray-300 w-12 h-12 rounded-full mb-2 flex items-center justify-center">
            <span className="text-black font-bold">V</span>
          </div>
          <span className="text-white font-medium">Videos</span>
        </button>
        
        <button 
          onClick={onExams}
          className="flex flex-col items-center justify-center w-24 h-24 bg-white/20 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl hover:bg-white/30 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="bg-white dark:bg-gray-300 w-12 h-12 rounded-full mb-2 flex items-center justify-center">
            <span className="text-black font-bold">E</span>
          </div>
          <span className="text-white font-medium">Exams</span>
        </button>
      </div>
    </div>
  );
}

export default CourseResourceCard;