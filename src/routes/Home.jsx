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
      {/* Future homepage sections will be added below */}
    </div>
  );
}
