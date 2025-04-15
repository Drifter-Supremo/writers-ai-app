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
      // Use .card-creative defined in index.css
      className={`card-creative p-6 cursor-pointer transition-shadow duration-300 relative ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Use new text colors */}
      <h2 className="text-xl font-bold text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary mb-4">{description}</p>
      <p className="text-sm text-text-secondary">Created: {createdAt?.toDate().toLocaleDateString()}</p>

      <div
        className="absolute top-4 right-4"
        ref={dropdownRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          // Use .dropdown-menu-button defined in index.css
          className="text-2xl font-bold dropdown-menu-button"
          aria-label="Open actions menu"
        >
          ⋮
        </button>

        {dropdownOpen && (
          // Use .dropdown-menu defined in index.css
          <div className="dropdown-menu"> 
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              // Use error status color from index.css
              className="dropdown-menu-item-error" 
            >
              {isDeleting ? (
                 // Ensure spinner uses error color
                <svg className="animate-spin h-5 w-5 inline-block mr-2 text-status-error" viewBox="0 0 24 24">
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
