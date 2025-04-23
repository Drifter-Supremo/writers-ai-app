import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { storage } from '../services/firebase';
import ProjectFiles from '../components/ProjectFiles';
import ProjectNotes from '../components/ProjectNotes';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import Notification from '../components/Notification'; // Import Notification component
import ProjectSettings from '../components/ProjectSettings';
import ProjectOverview from '../components/ProjectOverview';
import ProjectOverviewSkeleton from '../components/ProjectOverviewSkeleton';
import ProjectProgressDropdown from '../components/ProjectProgressDropdown';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState(undefined);
  const [activeSection, setActiveSection] = useState('overview');
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // For file deletion/upload feedback
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Notification state for errors
  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' } | null

  // Auto-dismiss notification after a delay
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000); // Dismiss after 4 seconds

      // Cleanup timer if component unmounts or notification changes
      return () => clearTimeout(timer);
    }
  }, [notification]); // Re-run effect when notification changes

  // On mount, set activeSection from hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'files', 'notes', 'settings'].includes(hash)) {
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (data.userId && user && data.userId !== user.uid) {
            setProject("notfound");
          } else {
            setProject({ ...data, progressStatus: data.progressStatus || 'Brainstorming' });
          }
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setProject("notfound");
      }
    }

    async function fetchFiles() {
      setFiles(undefined);
      try {
        if (!user?.uid) {
          setFiles([]);
          return;
        }
        const q = query(collection(db, `projects/${id}/files`), where("userId", "==", user.uid));
        const filesSnap = await getDocs(q);
        setFiles(filesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
      } catch (error) {
        alert("Failed to fetch files.");
        setFiles([]);
      }
    }

    async function fetchNotes() {
      setLoadingNotes(true);
      try {
        if (!user?.uid) {
          setNotes([]);
          setLoadingNotes(false);
          return;
        }
        const q = query(collection(db, `projects/${id}/notes`), where("userId", "==", user.uid));
        const notesSnap = await getDocs(q);
        setNotes(
          notesSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        );
      } catch (error) {
        console.error("Error fetching notes:", error); // Log the error
        setNotification({
          type: "error",
          message: "Failed to load notes. Please try refreshing the page.",
        });
        setNotes([]); // Keep notes empty on error
      } finally {
        setLoadingNotes(false);
      }
    }

    fetchProject();
    fetchFiles();
    fetchNotes();
    // eslint-disable-next-line
  }, [id, user]);

  // File delete handler
  const handleDeleteFile = async (file) => {
    setDeletingFileId(file.id);
    try {
      // Delete from Storage
      const fileStorageRef = storageRef(storage, `users/${user.uid}/projects/${id}/files/${file.name}`);
      await deleteObject(fileStorageRef);
      // Delete Firestore document
      await deleteDoc(doc(db, `projects/${id}/files`, file.id));
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error) {
      alert("Failed to delete file.");
    } finally {
      setDeletingFileId(null);
    }
  };

  // Unified Note Save Handler (Add & Edit)
  const handleSaveNote = async (noteId, noteData) => {
    if (!user?.uid) return;
    setLoadingNotes(true);
    const { title, content } = noteData;

    try {
      if (noteId) {
        // Update existing note
        await updateDoc(doc(db, `projects/${id}/notes`, noteId), {
          title: typeof title === "string" ? title : "",
          content: typeof content === "string" ? content : "",
          lastUpdated: serverTimestamp(),
          userId: user.uid // Ensure userId is present on updates too
        });
        setNotification({ type: "success", message: "Note updated successfully" });
      } else {
        // Add new note
        await addDoc(collection(db, `projects/${id}/notes`), {
          title: typeof title === "string" ? title : "",
          content: typeof content === "string" ? content : "",
          createdAt: serverTimestamp(),
          userId: user.uid
        });
        setNotification({ type: "success", message: "Note added successfully" });
      }

      // Refresh notes after add or update
      const q = query(collection(db, `projects/${id}/notes`), where("userId", "==", user.uid));
      const notesSnap = await getDocs(q);
      setNotes(
        notesSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      );

    } catch (error) {
      console.error("Error saving note:", error); // Log the error
      setNotification({
        type: "error",
        message: `Failed to ${noteId ? 'update' : 'add'} note. Please try again.`
      });
    } finally {
      setLoadingNotes(false);
    }
  };

  // File upload handler (remains the same)
  const handleUploadFile = async (file) => {
    setUploading(true);
    try {
      // Use Firebase Storage and Firestore logic here as in the original implementation
      // For now, just simulate a delay
      await new Promise((res) => setTimeout(res, 1000));
      // After upload, refresh files (in real code, upload to storage and add to Firestore)
    } finally {
      setUploading(false);
    }
  };

  // Handle project progress status update
  const handleProgressStatusUpdate = async (newStatus) => {
    if (!user?.uid || !project?.id) return;
    try {
      const docRef = doc(db, "projects", project.id);
      await updateDoc(docRef, {
        progressStatus: newStatus,
        lastUpdated: serverTimestamp(), // Optional: add a timestamp for the update
      });
      setProject(prev => ({ ...prev, progressStatus: newStatus }));
      setNotification({ type: "success", message: `Project status updated to "${newStatus}"` });
    } catch (error) {
      console.error("Error updating project status:", error);
      setNotification({ type: "error", message: "Failed to update project status. Please try again." });
    }
  };

  if (project === "notfound") {
    return (
      <div className="p-6 text-center">
        {/* Use new status/text colors */}
        <div className="text-3xl font-bold text-status-error mb-4">Project Not Found</div>
        <div className="text-text-secondary">The project you are looking for does not exist or has been deleted.</div>
      </div>
    );
  }
  // Use new text color
  if (!project) return <ProjectOverviewSkeleton />;

  return (
    // Use new primary background, remove gradient
    <div className="grid grid-cols-[250px,1fr] min-h-full bg-primary-bg">
      {/* Sidebar Navigation - Use new card background and border, add rounded corners */}
      <div className="border-r border-accent-cream/30 bg-card-bg p-6 rounded-lg">
        <nav className="space-y-3">
          {/* Update button styles */}
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'overview'
                ? 'btn-creative' // Active state uses .btn-creative
                : 'text-text-secondary hover:bg-accent-orange/20' // Inactive state uses text-secondary and orange hover
            }`}
            onClick={() => {
              setActiveSection('overview');
              window.location.hash = 'overview';
            }}
          >
            Overview
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'files'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => {
              setActiveSection('files');
              window.location.hash = 'files';
            }}
          >
            Files
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'notes'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => {
              setActiveSection('notes');
              window.location.hash = 'notes';
            }}
          >
            Notes
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'settings'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => {
              setActiveSection('settings');
              window.location.hash = 'settings';
            }}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content Area Column */}
      <div className="flex flex-col h-full"> {/* Use flex-col and ensure full height */}

        {/* Outer wrapper for max-width and horizontal padding */}
        <div className="max-w-5xl mx-auto px-8 flex flex-col flex-grow"> {/* Apply constraints here */}

          {/* Scrollable Content Area - Keep flex-grow, overflow. Remove p-8, add pb-8 */}
          <div className="overflow-y-auto flex-grow pb-8">
            {/* Notification component */}
            <Notification
              message={notification?.message}
              type={notification?.type}
              onClose={() => setNotification(null)}
            />

            {/* Conditional Section Rendering */}
            {activeSection === 'overview' && (
              <ProjectOverview
                project={project}
                onSave={async (updated) => {
                  const docRef = doc(db, "projects", id);
                  try {
                    await updateDoc(docRef, updated); // Use updateDoc directly
                    setProject((prev) => ({ ...prev, ...updated }));
                    setNotification({ type: "success", message: "Project details saved." });
                  } catch (error) {
                    console.error("Error saving project details:", error);
                    setNotification({ type: "error", message: "Failed to save project details." });
                  }
                }}
              />
            )}
            {activeSection === 'files' && (
              <ProjectFiles
                files={files}
                onDeleteFile={handleDeleteFile}
                deletingFileId={deletingFileId}
                projectId={id}
                refreshFiles={async () => {
                  if (!user?.uid) { setFiles([]); return; }
                  const q = query(collection(db, `projects/${id}/files`), where("userId", "==", user.uid));
                  const filesSnap = await getDocs(q);
                  setFiles(filesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }}
              />
            )}
            {activeSection === 'notes' && (
              <ProjectNotes
                notes={notes}
                loadingNotes={loadingNotes}
                onSaveNote={handleSaveNote}
                onDeleteNote={async (noteId) => {
                  if (!user?.uid) return;
                  setLoadingNotes(true);
                  try {
                    await deleteDoc(doc(db, `projects/${id}/notes`, noteId));
                    setNotification({ type: "success", message: "Note deleted successfully" });
                    const q = query(collection(db, `projects/${id}/notes`), where("userId", "==", user.uid));
                    const notesSnap = await getDocs(q);
                    setNotes(
                      notesSnap.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                    );
                  } catch (error) {
                    setNotification({ type: "error", message: "Failed to delete note." });
                  } finally {
                    setLoadingNotes(false);
                  }
                }}
              />
            )}
            {activeSection === 'settings' && (
              <ProjectSettings />
            )}
          </div> {/* End Scrollable Content Area */}

        {/* Project Progress Dropdown (Now inside the outer wrapper) */}
        {activeSection === 'overview' && project && (
          /* Remove max-width, mx-auto, px-8. Keep pb-8, w-full */
          <div className="pb-8 w-full mt-0">
            <div className="max-w-xs"> {/* Constrain dropdown width, left-aligned */}
              <ProjectProgressDropdown
                currentStatus={project.progressStatus}
                projectId={id}
                onStatusChange={handleProgressStatusUpdate}
              />
            </div>
          </div>
        )}
      </div> {/* End Outer wrapper (Moved after conditional block) */}
      </div> {/* End Main Content Area Column */}
    </div> /* End Grid */
  );
}
