import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <span className="text-3xl font-bold text-accent-orange">8</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Projects</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">3</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Workflows Done</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">2</span>
            <span className="text-accent-cream text-xs mt-1 whitespace-nowrap">Workflows In Progress</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">15</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Files</span>
          </div>
          <div className="hidden md:block w-px h-10 bg-accent-cream/20 mx-2"></div>
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <span className="text-3xl font-bold text-accent-orange">24</span>
            <span className="text-accent-cream text-sm mt-1 whitespace-nowrap">Notes</span>
          </div>
        </div>
      </div>
    </>
  );
}

