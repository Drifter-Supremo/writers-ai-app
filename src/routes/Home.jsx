import React from "react";
import { useNavigate } from "react-router-dom";
// Removed: import CharacterWorkflowList from "../components/CharacterWorkflowList";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gradient mb-8">Welcome to Writers AI Assistant</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your creative workspace for managing writing projects, collaborating with AI, and organizing your ideas.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="card-creative p-6 flex flex-col items-center">
          <span className="text-5xl mb-4">📁</span>
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-gray-600 mb-4 text-center">
            View, create, and manage your writing projects. Store files, notes, and more.
          </p>
          <button
            className="btn-creative w-full text-center"
            onClick={() => navigate("/projects")}
          >
            Go to Projects
          </button>
        </div>
        <div className="card-creative p-6 flex flex-col items-center">
          <span className="text-5xl mb-4">⚙️</span>
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 mb-4 text-center">
            Customize your preferences, AI tone, and creative workflow.
          </p>
          <button
            className="btn-creative w-full text-center"
            onClick={() => navigate("/settings")}
          >
            Go to Settings
          </button>
        </div>
        {/* Removed Character Workflow Card */}
      </div>
      {/* Removed CharacterWorkflowList */}
    </div>
  );
}
