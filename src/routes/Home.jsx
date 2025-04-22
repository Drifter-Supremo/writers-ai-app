import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

// Removed: import CharacterWorkflowList from "../components/CharacterWorkflowList";

const QUOTES = [
  "Where stories find structure.",
  "Your muse, on demand.",
  "Ink meets intelligence.",
  "Write once, remember forever.",
  "Creativity, coordinated.",
  "One desk for every tale.",
  "Ideas in perfect orbit.",
  "Your words, always in context.",
  "From spark to script seamlessly."
];

function getRandomIndex(prevIdx) {
  let idx = Math.floor(Math.random() * QUOTES.length);
  // Avoid repeating the last quote
  while (QUOTES.length > 1 && idx === prevIdx) {
    idx = Math.floor(Math.random() * QUOTES.length);
  }
  return idx;
}

export default function Home() {
  const [quoteIdx, setQuoteIdx] = useState(() => getRandomIndex(-1));
  const [fade, setFade] = useState(true);
  const prevIdx = useRef(quoteIdx);

  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, workflowsDone: 0, workflowsInProgress: 0, files: 0, notes: 0 });

  useEffect(() => {
    if (!user?.uid) return;
    const projUnsub = onSnapshot(query(collection(db, 'projects'), where('userId', '==', user.uid)), snap => {
      setStats(prev => ({ ...prev, projects: snap.size }));
    });
    const wfUnsub = onSnapshot(query(collection(db, 'characterWorkflows'), where('userId', '==', user.uid)), snap => {
      const done = snap.docs.filter(doc => doc.data().completed).length;
      setStats(prev => ({ ...prev, workflowsDone: done, workflowsInProgress: snap.size - done }));
    });

    // Count files and notes across all user projects (regardless of subdoc userId)
    const updateFileNoteCounts = async () => {
      const projSnap = await getDocs(query(collection(db, 'projects'), where('userId', '==', user.uid)));
      let totalFiles = 0, totalNotes = 0;
      for (const project of projSnap.docs) {
        const fSnap = await getDocs(collection(db, `projects/${project.id}/files`));
        totalFiles += fSnap.size;
        const nSnap = await getDocs(collection(db, `projects/${project.id}/notes`));
        totalNotes += nSnap.size;
      }
      setStats(prev => ({ ...prev, files: totalFiles, notes: totalNotes }));
    };
    updateFileNoteCounts();

    return () => {
      projUnsub();
      wfUnsub();
    };
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const nextIdx = getRandomIndex(prevIdx.current);
        setQuoteIdx(nextIdx);
        prevIdx.current = nextIdx;
        setFade(true);
      }, 400); // Duration matches fade-out
    }, 6000); // 6 seconds per quote
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="-mt-6 -ml-4 max-w-4xl">
        <h1
          className={`text-3xl md:text-5xl font-migra font-semibold text-accent-cream transition-all duration-500 select-none ${
            fade ? "animate-fade-in" : "animate-fade-out"
          }`}
          style={{ letterSpacing: "0.01em", lineHeight: 1.2 }}
          aria-live="polite"
        >
          {QUOTES[quoteIdx]}
        </h1>
      </div>
      {/* User Stats Card - Always centered */}
      <div className="mt-8">
        <div className="card-creative max-w-3xl px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 shadow-card">
          {/* Stat Pill */}
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">{stats.projects}</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Projects</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">{stats.workflowsDone}</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Workflows Done</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">{stats.workflowsInProgress}</span>
            <span className="text-accent-cream text-xs mt-1 whitespace-nowrap">Workflows In Progress</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">{stats.files}</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Files</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">{stats.notes}</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Notes</span>
          </div>
        </div>
      </div>
    </>
  );
}
