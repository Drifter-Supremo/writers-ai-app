import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import ProjectFiles from '../components/ProjectFiles';
import ProjectNotes from '../components/ProjectNotes';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import ProjectSettings from '../components/ProjectSettings';
import ProjectOverview from '../components/ProjectOverview';
import ProjectOverviewSkeleton from '../components/ProjectOverviewSkeleton';

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
            setProject(data);
          }
        } else {
          setProject(null);
        }
      } catch (error) {
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
        setNotes([]);
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
      await deleteDoc(doc(db, `projects/${id}/files`, file.id));
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch (error) {
      alert("Failed to delete file.");
    } finally {
      setDeletingFileId(null);
    }
  };

  // File upload handler
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
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'files'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => setActiveSection('files')}
          >
            Files
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'notes'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => setActiveSection('notes')}
          >
            Notes
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'settings'
                ? 'btn-creative'
                : 'text-text-secondary hover:bg-accent-orange/20'
            }`}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content - Inherits primary-bg */}
      <div className="p-8 overflow-auto"> {/* Added overflow-auto */}
        <div className="max-w-5xl mx-auto">
          {activeSection === 'overview' && (
            <ProjectOverview // Assumes ProjectOverview uses correct theme styles
              project={project}
              onSave={async (updated) => {
                // Save to Firestore
                const docRef = doc(db, "projects", id);
                await docRef.update
                  ? await docRef.update(updated)
                  : await import('firebase/firestore').then(({ updateDoc }) =>
                      updateDoc(docRef, updated)
                    );
                setProject((prev) => ({
                  ...prev,
                  ...updated,
                  tags: updated.tags,
                }));
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
              }}
            />
          )}
          {activeSection === 'notes' && (
            <ProjectNotes
              notes={notes}
              loadingNotes={loadingNotes}
              onAddNote={async (content) => {
                if (!user?.uid) return;
                setLoadingNotes(true);
                try {
                  await addDoc(collection(db, `projects/${id}/notes`), {
                    content,
                    createdAt: serverTimestamp(),
                    userId: user.uid
                  });
                  // Refresh notes
                  const q = query(collection(db, `projects/${id}/notes`), where("userId", "==", user.uid));
                  const notesSnap = await getDocs(q);
                  setNotes(
                    notesSnap.docs
                      .map(doc => ({ id: doc.id, ...doc.data() }))
                      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
                  );
                } catch (error) {
                  // Optionally handle error
                } finally {
                  setLoadingNotes(false);
                }
              }}
            />
          )}
          {activeSection === 'settings' && (
            <ProjectSettings />
          )}
        </div>
      </div>
    </div>
  );
}
