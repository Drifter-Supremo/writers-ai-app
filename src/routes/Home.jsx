import React from "react";
import { useNavigate } from "react-router-dom";
// Removed: import CharacterWorkflowList from "../components/CharacterWorkflowList";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* text-gradient updated via index.css - Update heading text */}
      <h1 className="text-4xl font-bold text-gradient mb-8">Welcome to Gorlea Projects</h1>
      {/* Use new text color */}
      <p className="text-lg text-text-secondary mb-8">
        Your creative workspace for managing writing projects, collaborating with AI, and organizing your ideas.
      </p>

    </div>
  );
}
