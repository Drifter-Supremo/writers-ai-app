import { useEffect, useState, useRef } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import LinkWorkflowModal from './LinkWorkflowModal'; // Added import
import Notification from './Notification'; // Import the Notification component
import LinkedProjectDisplay from './LinkedProjectDisplay'; // Import the new component

export default function CharacterWorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRefs = useRef({});
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false); // Added state
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null); // Added state
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWorkflows() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "characterWorkflows"));
        setWorkflows(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        alert("Failed to fetch workflows.");
      } finally {
        setLoading(false);
      }
    }
    fetchWorkflows();
  }, [deletingId]);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Check all menu refs
      const openMenuRef = menuRefs.current[menuOpenId];
      if (openMenuRef && !openMenuRef.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workflow? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, "characterWorkflows", id));
      setWorkflows((prev) => prev.filter((wf) => wf.id !== id));
      // Reset menu and deletingId after a short delay to ensure re-render
      setTimeout(() => {
        setDeletingId(null);
        setMenuOpenId(null);
      }, 300);
    } catch (error) {
      alert("Failed to delete workflow.");
      setDeletingId(null);
      setMenuOpenId(null);
    }
  };

  const handleOpenLinkModal = (id) => {
    setSelectedWorkflowId(id);
    setIsLinkModalOpen(true);
    setMenuOpenId(null); // Close the menu when opening the modal
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setSelectedWorkflowId(null);
  };

  const handleLinkCompletion = (success, message) => {
    setNotification({ message: message, type: success ? 'success' : 'error' });
    // Auto-clear the notification
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleUnlink = async (workflowId) => {
    // Optional: Confirmation dialog
    if (!window.confirm("Are you sure you want to unlink this workflow from its project?")) {
      setMenuOpenId(null); // Close menu if cancelled
      return;
    }

    setMenuOpenId(null); // Close menu immediately

    try {
      const workflowRef = doc(db, "characterWorkflows", workflowId);
      // Remove the linkedProjectId field from Firestore
      await updateDoc(workflowRef, {
        linkedProjectId: deleteField()
      });

      // Update local state to reflect the change immediately
      setWorkflows(prevWorkflows =>
        prevWorkflows.map(wf =>
          wf.id === workflowId
            ? { ...wf, linkedProjectId: null } // Set local linkedProjectId to null
            : wf
        )
      );

      // Trigger success notification (using the existing handler)
      handleLinkCompletion(true, 'Workflow successfully unlinked!');

    } catch (error) {
      console.error("Error unlinking workflow:", error);
      // Trigger error notification
      handleLinkCompletion(false, 'Failed to unlink workflow.');
    }
  };

  return (
    <div className="mt-12">
      {/* Use new text color */}
      <h2 className="text-2xl font-bold text-text-primary mb-4">My Character Workflows</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            // Use card-creative and dark theme skeleton colors
            <div key={index} className="card-creative p-6 animate-pulse">
              <div className="h-4 bg-card-bg/70 rounded w-3/4 mb-2"></div> {/* Title */}
              <div className="h-3 bg-card-bg/50 rounded w-1/2 mb-2"></div> {/* Date */}
              <div className="h-3 bg-card-bg/50 rounded w-1/4 mb-4"></div> {/* Status */}
              <div className="flex gap-2">
                <div className="h-10 bg-card-bg/70 rounded w-20"></div> {/* Button */}
                <div className="h-10 bg-card-bg/70 rounded w-8"></div>  {/* Menu Button */}
              </div>
            </div>
          ))}
        </div>
      ) : workflows.length === 0 ? (
        // Use new text color
        <div className="text-text-secondary">No character workflows yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              // Use .card-creative
              className={`card-creative p-6 flex flex-col items-start relative transition-opacity duration-500 ${
                deletingId === wf.id ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {/* Use new text color */}
              <div className="font-semibold text-text-primary mb-2 break-all">
                {wf.name || "Untitled Character"}
              </div>
              {/* Use new text color */}
              <div className="text-text-secondary text-sm mb-2">
                Created:{" "}
                {wf.createdAt?.toDate
                  ? wf.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </div>
              <div className="mb-4">
                {/* Use new status colors */}
                {wf.completed ? (
                  <span className="text-status-success font-medium">Complete</span>
                ) : (
                  <span className="text-status-warning font-medium">In Progress</span>
                )}
              </div>
              {/* Linked Project Indicator */}
              {/* Use the new component to display the linked project name */}
              {wf.linkedProjectId && <LinkedProjectDisplay projectId={wf.linkedProjectId} />}
              <div className="flex gap-2 items-center"> {/* Added items-center for vertical alignment */}
                {/* Use .btn-creative */}
                {wf.completed ? (
                  // Add min-width to prevent resize
                  <button
                    className="btn-creative min-w-[80px]" 
                    onClick={() => navigate(`/character-workflow?id=${wf.id}&view=1`)}
                  >
                    View
                  </button>
                ) : (
                  // Add min-width to prevent resize
                  <button
                    className="btn-creative min-w-[80px]" 
                    onClick={() => navigate(`/character-workflow?id=${wf.id}`)}
                  >
                    Resume
                  </button>
                )}
                <div
                  className="relative"
                  ref={el => (menuRefs.current[wf.id] = el)}
                >
                  {/* Use .dropdown-menu-button */}
                  <button
                    className="text-2xl font-bold dropdown-menu-button ml-2 flex items-center justify-center h-full" // Added flex alignment for button content
                    onClick={() => setMenuOpenId(menuOpenId === wf.id ? null : wf.id)}
                  >
                    ⋮
                  </button>
                  {menuOpenId === wf.id && (
                    // Use .dropdown-menu
                    <div className="dropdown-menu absolute right-0 mt-1 w-48"> {/* Position dropdown */}
                      {/* Link to Project Button - Use .dropdown-menu-item */}
                       <button
                         onClick={() => handleOpenLinkModal(wf.id)}
                         disabled={!!wf.linkedProjectId} // Disable if linkedProjectId exists
                         className={`dropdown-menu-item ${wf.linkedProjectId ? 'opacity-50 cursor-not-allowed' : ''}`} // Add disabled styles
                       >
                         {wf.linkedProjectId ? 'Already Linked' : 'Link to Project'}
                       </button>
                       {/* Unlink Button - Use .dropdown-menu-item-warning */}
                       {wf.linkedProjectId && (
                         <button
                           onClick={() => handleUnlink(wf.id)}
                           className="dropdown-menu-item-warning" // Use warning status color
                         >
                           Unlink Project
                         </button>
                       )}
                      {/* Delete Button - Use .dropdown-menu-item-error */}
                      <button
                        onClick={() => handleDelete(wf.id)}
                        disabled={deletingId === wf.id}
                        className="dropdown-menu-item-error" // Use error status color
                      >
                        {deletingId === wf.id ? (
                          <span className="flex items-center gap-2">
                            {/* Use error status color for spinner */}
                            <svg className="animate-spin h-5 w-5 text-status-error" viewBox="0 0 24 24"> 
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
                            Deleting...
                          </span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    {/* Render the Modal */}
    <LinkWorkflowModal
      isOpen={isLinkModalOpen}
      onClose={handleCloseLinkModal}
      workflowId={selectedWorkflowId}
      onLinkComplete={handleLinkCompletion} // Pass the handler
    />
    {/* Render the Notification component */}
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification({ message: '', type: '' })}
    />
    </div>
  );
}
