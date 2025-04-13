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

  return (
    <div className="p-6">
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          Changes saved successfully!
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
              className="text-gray-600 px-4 py-2 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          <p className="text-gray-600">{project.description}</p>
          {project.tags?.length > 0 && (
            <div className="mt-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
            disabled={uploading}
          />
          <button
            type="submit"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Files</h2>
        {files.length === 0 ? (
          <p className="text-gray-600">No files uploaded yet</p>
        ) : (
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.id} className="flex items-center gap-2">
                <a 
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Notes</h2>
        <form onSubmit={handleAddNote} className="mb-4 flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Write a note..."
            disabled={loadingNotes}
          />
          <button
            type="submit"
            disabled={!newNote.trim() || loadingNotes}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            Add
          </button>
        </form>

        {loadingNotes && <p className="text-gray-600">Loading...</p>}
        
        {!loadingNotes && notes.length === 0 ? (
          <p className="text-gray-600">No notes yet</p>
        ) : (
          <ul className="space-y-3">
            {notes.map(note => (
              <li key={note.id} className="flex justify-between items-start bg-white p-3 rounded shadow">
                <div>
                  <p className="mb-1">{note.content}</p>
                  <span className="text-sm text-gray-500">
                    {note.createdAt?.toDate().toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
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
  );
}
