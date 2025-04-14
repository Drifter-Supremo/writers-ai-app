import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import ProjectFiles from '../components/ProjectFiles';
import ProjectNotes from '../components/ProjectNotes';
import ProjectSettings from '../components/ProjectSettings';
import ProjectOverview from '../components/ProjectOverview';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');

  // For file deletion/upload feedback
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
    }
    async function fetchFiles() {
      const filesSnap = await getDocs(collection(db, `projects/${id}/files`));
      setFiles(filesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    }
    fetchProject();
    fetchFiles();
  }, [id]);

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

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="grid grid-cols-[250px,1fr] min-h-full bg-gradient-to-br from-gray-50 to-creative-purple-50">
      {/* Sidebar Navigation */}
      <div className="border-r border-creative-purple-100 bg-white/80 backdrop-blur-sm p-6">
        <nav className="space-y-3">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'overview'
                ? 'btn-creative'
                : 'text-creative-purple-700 hover:bg-creative-purple-50'
            }`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'files'
                ? 'btn-creative'
                : 'text-creative-purple-700 hover:bg-creative-purple-50'
            }`}
            onClick={() => setActiveSection('files')}
          >
            Files
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'notes'
                ? 'btn-creative'
                : 'text-creative-purple-700 hover:bg-creative-purple-50'
            }`}
            onClick={() => setActiveSection('notes')}
          >
            Notes
          </button>
          <button
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeSection === 'settings'
                ? 'btn-creative'
                : 'text-creative-purple-700 hover:bg-creative-purple-50'
            }`}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {activeSection === 'overview' && (
            <ProjectOverview
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
                const filesSnap = await getDocs(collection(db, `projects/${id}/files`));
                setFiles(filesSnap.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                })));
              }}
            />
          )}
          {activeSection === 'notes' && (
            <ProjectNotes onAddNote={() => {}} />
          )}
          {activeSection === 'settings' && (
            <ProjectSettings />
          )}
        </div>
      </div>
    </div>
  );
}
