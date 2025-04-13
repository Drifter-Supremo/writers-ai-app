import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ id, title, description, createdAt }) {
  const navigate = useNavigate();
  
  const formattedDate = createdAt 
    ? new Date(createdAt.seconds * 1000).toLocaleDateString()
    : 'Date not available';

  return (
    <div className="card-creative group relative overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        {/* Decorative gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-creative-purple-500 to-creative-blue-500"></div>
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gradient">{title}</h2>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 animate-float">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Delete functionality will be added later
              }}
              className="text-creative-purple-300 hover:text-red-400 p-1 transition-colors duration-200"
              title="Delete project"
            >
              <span>🗑️</span>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{description}</p>
        
        {/* Card Footer */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-creative-purple-400 flex items-center gap-2">
            <span>🕒</span>
            Last modified: {formattedDate}
          </span>
          <button 
            onClick={() => navigate(`/projects/${id}`)}
            className="btn-creative py-2"
          >
            Open Project
          </button>
        </div>
      </div>
    </div>
  );
}
