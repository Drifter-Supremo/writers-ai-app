import { useEffect, useState, useRef } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function CharacterWorkflowList() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRefs = useRef({});
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

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gradient mb-4">My Character Workflows</h2>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : workflows.length === 0 ? (
        <div className="text-gray-400">No character workflows yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`card-creative p-6 flex flex-col items-start relative transition-opacity duration-500 ${
                deletingId === wf.id ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="font-semibold text-creative-purple-700 mb-2 break-all">
                {wf.name || "Untitled Character"}
              </div>
              <div className="text-gray-500 text-sm mb-2">
                Created:{" "}
                {wf.createdAt?.toDate
                  ? wf.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </div>
              <div className="mb-4">
                {wf.completed ? (
                  <span className="text-green-600 font-medium">Complete</span>
                ) : (
                  <span className="text-yellow-600 font-medium">In Progress</span>
                )}
              </div>
              <div className="flex gap-2">
                {wf.completed ? (
                  <button
                    className="btn-creative"
                    onClick={() => navigate(`/character-workflow?id=${wf.id}&view=1`)}
                  >
                    View
                  </button>
                ) : (
                  <button
                    className="btn-creative"
                    onClick={() => navigate(`/character-workflow?id=${wf.id}`)}
                  >
                    Resume
                  </button>
                )}
                <div
                  className="relative"
                  ref={el => (menuRefs.current[wf.id] = el)}
                >
                  <button
                    className="text-2xl font-bold text-creative-purple-600 hover:text-creative-purple-800 transition-colors duration-200 ml-2"
                    onClick={() => setMenuOpenId(menuOpenId === wf.id ? null : wf.id)}
                  >
                    ⋮
                  </button>
                  {menuOpenId === wf.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={() => handleDelete(wf.id)}
                        disabled={deletingId === wf.id}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        {deletingId === wf.id ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
    </div>
  );
}
