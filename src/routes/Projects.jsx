import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import ProjectCard from '../components/ProjectCard';
import SkeletonProjectCard from '../components/SkeletonProjectCard';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
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
    try {
      if (!user?.uid) {
        setProjects([]);
        setIsLoading(false);
        return;
      }
      const q = query(collection(db, "projects"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      alert("Failed to fetch projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [user]);

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
        createdAt: serverTimestamp(),
        userId: user?.uid || null
      });
      // Reset form
      setFormData({ name: '', description: '' });
      setShowForm(false);
      // Re-fetch projects
      fetchProjects();
    } catch (error) {
      alert("Failed to create project.");
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
      alert("Failed to delete project.");
    } finally {
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-12 max-w-6xl mx-auto w-full">
        {/* Use text-text-primary (updated via index.css) */}
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
        {/* Use .btn-creative */}
        <button
          onClick={handleNewProject}
          className="btn-creative px-3 py-1.5 text-sm flex items-center space-x-2 group mt-6 sm:mt-0"
        >
          <span className="text-xl transition-transform duration-200 group-hover:rotate-90">+</span>
          <span>New Project</span>
        </button>
      </div>
      
      {/* Search and Filter Area - Use .card-creative and new bg */}
      <div className="card-creative p-6 mb-12 max-w-6xl mx-auto">
        {/* Search input - Use .input-creative */}
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
               // Use new accent color for clear button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-orange hover:text-accent-orange-hover transition-all duration-200 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Filter/Tag strip placeholder - Use new colors */}
        <div className="mt-6 flex items-center space-x-3 text-sm">
          {/* Use new text color */}
          <span className="text-text-primary font-medium">Filters:</span>
          {/* Use .tag-creative */}
          <div className="tag-creative cursor-pointer hover:scale-105 transition-transform duration-200">All Projects</div>
          <div className="tag-creative cursor-pointer hover:scale-105 transition-transform duration-200">Recent</div>
          {/* Use new colors for Add Filter button */}
          <div className="bg-card-bg/80 px-4 py-2 rounded-full text-accent-orange font-medium border-2 border-dashed border-accent-cream/50 hover:border-accent-cream hover:bg-card-bg transition-all duration-200 cursor-pointer hover:scale-105">+ Add Filter</div>
        </div>
      </div>

      {showForm && (
        // Use .card-creative
        <form onSubmit={handleSubmit} className="card-creative p-8 mb-12 max-w-6xl mx-auto">
          <div className="mb-6">
            {/* Use .input-creative */}
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
            {/* Use .input-creative */}
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
            {/* Use .btn-creative */}
            <button
              type="submit"
              className="btn-creative"
              disabled={creatingProject}
            >
              {creatingProject ? 'Creating...' : 'Create Project'}
            </button>
            {/* Use .btn-creative-secondary */}
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
            <SkeletonProjectCard key={index} /> // Assuming SkeletonProjectCard uses appropriate dark theme styles
          ))
        ) : (
          projects
            .filter(project =>
              project.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              project.description.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
            .map(project => (
              <ProjectCard // Uses updated ProjectCard styles
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
          // Use new text color for "No projects found"
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-text-secondary">
            <span className="text-6xl mb-6 animate-float">📝</span>
            <span className="text-lg font-medium animate-fade-in">No projects found matching your search</span>
          </div>
        )}
      </div>
    </div>
  );
}
