import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
export default function LinkWorkflowModal({ isOpen, onClose, workflowId, onLinkComplete }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Keep for general fetch errors if needed
  const [isUpdating, setIsUpdating] = useState(false); // State for update operation

  useEffect(() => {
    async function fetchProjects() {
      if (!isOpen) return; // Don't fetch if modal is closed

      setIsLoading(true);
      setError(null);
      setProjects([]); // Clear previous projects

      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Untitled Project', // Use 'name' field from Firestore
        }));
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError('Failed to load projects. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [isOpen]); // Re-fetch when modal opens

  const handleLinkProject = async (selectedProjectId) => {
    if (!workflowId || !selectedProjectId || isUpdating) return;

    setIsUpdating(true);
    setError(null); // Clear previous errors

    try {
      const workflowRef = doc(db, 'characterWorkflows', workflowId);
      await updateDoc(workflowRef, {
        linkedProjectId: selectedProjectId,
      });
      onLinkComplete(true, 'Workflow successfully linked!'); // Signal success to parent
      console.log(`Workflow ${workflowId} linked to project ${selectedProjectId}`);
      // Keep onClose() here if you want the modal to close immediately after linking
      // Or move it after the timeout if you want the user to see the notification before closing
      onClose();
    } catch (err) {
      console.error("Error linking workflow to project:", err);
      onLinkComplete(false, 'Failed to link workflow. Please try again.'); // Signal failure to parent
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          aria-label="Close modal"
          disabled={isUpdating} // Disable close while updating
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-creative-purple-700">Link Workflow to Project</h2>

        {isLoading && (
          <div className="space-y-2 p-2 mb-4"> {/* Added container and spacing */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-8 bg-gray-300 rounded w-full animate-pulse"></div>
            ))}
          </div>
        )}

        {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}

        {!isLoading && !error && (
          <>
            {projects.length === 0 ? (
              <div className="text-center text-gray-500 my-4">
                No projects found. Create a project first.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border rounded p-2 mb-4">
                <ul className="space-y-2">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <button
                        onClick={() => handleLinkProject(project.id)}
                        disabled={isUpdating} // Disable buttons while updating
                        className={`w-full text-left p-2 rounded transition-colors duration-200 ${
                          isUpdating
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'hover:bg-creative-purple-100 text-creative-purple-800'
                        }`}
                      >
                        {project.name} {/* Display project name */}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            disabled={isUpdating} // Disable close while updating
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div> {/* Close modal content div */}
    </div> /* Close modal backdrop div */
  );
}