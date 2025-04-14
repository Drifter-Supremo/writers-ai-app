import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ id, title, description, createdAt, onDelete, isDeleting }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // Attach event listener for clicks outside dropdown
  useState(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDelete(id);
    }
  };

  const handleOpenClick = (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    navigate(`/projects/${id}`);
  };

  return (
    <div
      onClick={() => navigate(`/projects/${id}`)}
      className={`card-creative p-6 cursor-pointer hover:shadow-creative-lg transition-shadow duration-300 relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <h2 className="text-xl font-bold text-gradient mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-sm text-gray-400">Created: {createdAt?.toDate().toLocaleDateString()}</p>

      <div
        className="absolute top-4 right-4"
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-2xl font-bold text-creative-purple-600 hover:text-creative-purple-800 transition-colors duration-200"
          aria-label="Open actions menu"
        >
          ⋮
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors duration-200"
            >
              {isDeleting ? (
                <svg className="animate-spin h-5 w-5 inline-block mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
