import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Adjust path if needed

export default function LinkedProjectDisplay({ projectId }) {
  const [projectName, setProjectName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setProjectName(null); // Reset project name if projectId is null/undefined
      return;
    }

    async function fetchProjectName() {
      setLoading(true);
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjectName(docSnap.data().name || '[Untitled Project]');
        } else {
          console.warn(`Project document with ID ${projectId} not found.`);
          setProjectName('[Project Not Found]');
        }
      } catch (error) {
        console.error("Error fetching project name:", error);
        setProjectName('[Error Fetching Name]'); // More specific error message
      } finally {
        setLoading(false);
      }
    }

    fetchProjectName();
  }, [projectId]);

  if (!projectId) return null; // Don't render anything if there's no projectId

  return (
    <div className="text-sm text-blue-600 font-medium mt-1 mb-2">
      {loading ? (
        <span>🔗 Loading project...</span>
      ) : (
        <span>🔗 Linked to {projectName}</span>
      )}
    </div>
  );
}