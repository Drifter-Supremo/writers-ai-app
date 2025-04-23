import React, { useState } from 'react';

const ProjectProgressDropdown = ({ currentStatus, projectId, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses = ["Brainstorming", "Crafting", "First Draft Done", "Rewriting", "Done"];

  const handleStatusChange = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button Design */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-64 px-4 py-3
                   bg-teal-light border border-cream-yellow/30 rounded-lg
                   hover:border-cream-yellow/50 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-orange-vibrant"
      >
        <div className="flex items-center">
          {/* Dynamic status indicator color */}
          <div className={`w-3 h-3 rounded-full mr-3 ${
            currentStatus === "Brainstorming" ? "bg-yellow-500" :
            currentStatus === "Done" ? "bg-green-500" :
            "bg-orange-vibrant"
          }`}></div>
          <span className="text-cream-yellow font-medium">{currentStatus}</span>
        </div>
        <svg
          className={`w-5 h-5 text-cream-yellow transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu Design */}
      <div
        className={`absolute z-10 mt-1 w-full md:w-64
                    bg-teal-light border border-cream-yellow/30 rounded-lg
                    shadow-lg overflow-hidden
                    transition-all duration-200 origin-top
                    ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        {/* Dropdown Options Design */}
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`w-full text-left px-4 py-3 flex items-center
                        transition-colors duration-200
                        ${currentStatus === status
                          ? 'bg-orange-vibrant/20 text-orange-vibrant'
                          : 'text-cream-yellow hover:bg-orange-vibrant/10'}`}
          >
            {/* Dynamic status indicator color */}
            <div
              className={`w-3 h-3 rounded-full mr-3
                         ${status === "Brainstorming" ? "bg-yellow-500" :
                           status === "Done" ? "bg-green-500" :
                           "bg-orange-vibrant"}`}
            ></div>
            {status}
            {currentStatus === status && (
              <svg className="ml-auto w-5 h-5 text-orange-vibrant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectProgressDropdown;