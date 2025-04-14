import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import ProjectCard from '../components/ProjectCard';
import SkeletonProjectCard from '../components/SkeletonProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [creatingProject, setCreatingProject] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProjects = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Fetched projects:', projectsData);
    setProjects(projectsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    try {
      await addDoc(collection(db, "projects"), {
        name: formData.name,
        description: formData.description,
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setShowForm(false);
      
      // Re-fetch projects
      fetchProjects();
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setCreatingProject(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setDeletingProjectId(projectId);
    try {
      // Delete project document
      await deleteDoc(doc(db, "projects", projectId));
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 max-w-6xl mx-auto w-full">
        <h1
          className="text-4xl font-bold text-gradient animate-float break-words w-full sm:w-auto"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          Your Projects
        </h1>
        <button
          onClick={handleNewProject}
          className="btn-creative flex items-center space-x-2 group mt-6 sm:mt-0"
        >
          <span className="text-xl transition-transform duration-200 group-hover:rotate-90">+</span>
          <span>New Project</span>
        </button>
      </div>
      
      {/* Search and Filter Area */}
      <div className="card-creative p-6 mb-12 max-w-6xl mx-auto backdrop-blur-sm bg-white/70">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-creative"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-creative-purple-400 hover:text-creative-purple-600 transition-all duration-200 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Filter/Tag strip placeholder */}
        <div className="mt-6 flex items-center space-x-3 text-sm">
          <span className="text-creative-purple-700 font-medium">Filters:</span>
          <div className="tag-creative cursor-pointer hover:scale-105 transition-transform duration-200">All Projects</div>
          <div className="tag-creative cursor-pointer hover:scale-105 transition-transform duration-200">Recent</div>
          <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full text-creative-purple-500 font-medium border-2 border-dashed border-creative-purple-200 hover:border-creative-purple-300 hover:bg-white transition-all duration-200 cursor-pointer hover:scale-105">+ Add Filter</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-creative p-8 mb-12 max-w-6xl mx-auto">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-creative"
              required
            />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-creative"
              rows="3"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn-creative"
              disabled={creatingProject}
            >
              {creatingProject ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-creative-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-in">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonProjectCard key={index} />
          ))
        ) : (
          projects
            .filter(project =>
              project.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              project.description.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
            .map(project => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.name}
                description={project.description}
                createdAt={project.createdAt}
                onDelete={handleDeleteProject}
                isDeleting={deletingProjectId === project.id}
              />
            ))
        )}
        {debouncedQuery && !isLoading && projects.filter(project =>
          project.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(debouncedQuery.toLowerCase())
        ).length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-creative-purple-400">
            <span className="text-6xl mb-6 animate-float">📝</span>
            <span className="text-lg font-medium animate-fade-in">No projects found matching your search</span>
          </div>
        )}
      </div>
    </div>
  );
}
