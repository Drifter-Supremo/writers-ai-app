import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, deleteDoc, serverTimestamp, getDocs, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../services/firebase';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: ''
  });

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const notesSnap = await getDocs(collection(db, `projects/${id}/notes`));
      setNotes(notesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      setLoadingNotes(true);
      await addDoc(collection(db, `projects/${id}/notes`), {
        content: newNote,
        createdAt: serverTimestamp()
      });
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setLoadingNotes(true);
      await deleteDoc(doc(db, `projects/${id}/notes`, noteId));
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const fetchFiles = async () => {
    const filesSnap = await getDocs(collection(db, `projects/${id}/files`));
    setFiles(filesSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  };

  const handleDelete = async (file) => {
    try {
      // 1. Delete from storage
      const fileRef = storageRef(storage, `projects/${id}/files/${file.name}`);
      await deleteObject(fileRef);

      // 2. Delete from Firestore
      const docRef = doc(db, `projects/${id}/files`, file.id);
      await deleteDoc(docRef);

      // 3. Refresh file list
      fetchFiles();
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload to Storage
      const fileRef = storageRef(storage, `projects/${id}/files/${file.name}`);
      await uploadBytes(fileRef, file);

      // 2. Get download URL
      const url = await getDownloadURL(fileRef);

      // 3. Save to Firestore
      await addDoc(collection(db, `projects/${id}/files`), {
        name: file.name,
        url,
        type: file.type,
        createdAt: serverTimestamp()
      });

      // 4. Reset form & refresh files
      e.target.reset();
      fetchFiles();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    async function fetchProject() {
      const docRef = doc(db, "projects", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const projectData = { id: docSnap.id, ...docSnap.data() };
        setProject(projectData);
        setFormData({
          name: projectData.name || '',
          description: projectData.description || '',
          tags: projectData.tags?.join(', ') || ''
        });
      }
    }

    fetchProject();
    fetchFiles();
    fetchNotes();
  }, [id]);

  if (!project) return <div className="p-6">Loading...</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Refresh project data
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        setProject({ id: updatedSnap.id, ...updatedSnap.data() });
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  if (!project) return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-300 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-[250px,1fr] min-h-full bg-gradient-to-br from-gray-50 to-creative-purple-50">
      {/* Left Panel - Navigation */}
      <div className="border-r border-creative-purple-100 bg-white/80 backdrop-blur-sm p-6">
        <nav className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-lg btn-creative">
            Overview
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-creative-purple-700 hover:bg-creative-purple-50 transition-colors duration-200 font-medium">
            Files
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-creative-purple-700 hover:bg-creative-purple-50 transition-colors duration-200 font-medium">
            Notes
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg text-creative-purple-700 hover:bg-creative-purple-50 transition-colors duration-200 font-medium">
            Settings
          </button>
        </nav>
      </div>

      {/* Right Panel - Content */}
      <div className="p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-gradient-to-r from-green-50 to-creative-blue-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-creative mb-8 flex items-center">
              <span className="text-2xl mr-3 animate-bounce">✨</span>
              Changes saved successfully!
            </div>
          )}

          {/* Project Overview */}
          {editing ? (
            <form onSubmit={handleSave} className="card-creative p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-creative-purple-900 text-sm font-bold mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-creative"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-creative-purple-900 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-creative"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-creative-purple-900 text-sm font-bold mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-creative"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn-creative"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: project.name || '',
                        description: project.description || '',
                        tags: project.tags?.join(', ') || ''
                      });
                    }}
                    className="btn-creative-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="card-creative p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gradient">{project.name}</h1>
                <button
                  onClick={() => setEditing(true)}
                  className="text-creative-purple-500 hover:text-creative-purple-700 transition-colors duration-200"
                >
                  ✏️ Edit
                </button>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="tag-creative"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* File Upload Section */}
          <div className="card-creative p-8">
            <h2 className="text-2xl font-bold text-gradient mb-6">Files</h2>
            <form onSubmit={handleUpload} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
                  disabled={uploading}
                  className="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                             file:bg-creative-purple-50 file:text-creative-purple-700 
                             hover:file:bg-creative-purple-100 file:transition-colors 
                             file:duration-200 file:cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-creative py-2"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>

          {files.length === 0 ? (
            <p className="text-creative-purple-400 text-center py-8">No files uploaded yet</p>
          ) : (
            <ul className="space-y-2">
              {files.map(file => (
                <li key={file.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-creative-purple-100 hover:border-creative-purple-200 transition-colors duration-200">
                  <a 
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-creative-purple-600 hover:text-creative-purple-800 transition-colors duration-200 flex items-center"
                  >
                    📄 {file.name}
                  </a>
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>
                </li>
              ))}
            </ul>
          )}
          </div>

          {/* Notes Section */}
          <div className="card-creative p-8">
            <h2 className="text-2xl font-bold text-gradient mb-6">Notes</h2>
            <form onSubmit={handleAddNote} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="input-creative"
                  placeholder="Write a note..."
                  disabled={loadingNotes}
                />
                <button
                  type="submit"
                  disabled={!newNote.trim() || loadingNotes}
                  className="btn-creative"
                >
                  Add
                </button>
              </div>
            </form>

          {loadingNotes && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex justify-between items-start bg-white p-4 rounded-lg border border-creative-purple-100 animate-pulse">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-10 h-6 rounded bg-gray-300"></div>
                </div>
              ))}
            </div>
          )}
          
          {!loadingNotes && notes.length === 0 ? (
            <p className="text-creative-purple-400 text-center py-8">No notes yet</p>
          ) : (
            <ul className="space-y-3">
              {notes.map(note => (
                <li key={note.id} className="flex justify-between items-start bg-white p-4 rounded-lg border border-creative-purple-100 hover:border-creative-purple-200 transition-colors duration-200">
                  <div>
                    <p className="mb-2 text-gray-700 leading-relaxed">{note.content}</p>
                    <span className="text-sm text-creative-purple-400">
                      {note.createdAt?.toDate().toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-400 hover:text-red-600 transition-colors duration-200 ml-4"
                    disabled={loadingNotes}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
