import React from 'react';
import { useNavigate } from "react-router-dom"; // Added import
import CharacterWorkflowList from "../components/CharacterWorkflowList"; // Added import

function Workflows() {
  const navigate = useNavigate(); // Added hook

  return (
    <div className="p-8 max-w-4xl mx-auto"> {/* Added container div with padding */}
      <h1 className="text-4xl font-bold text-gradient mb-8">Workflows</h1> {/* Changed title */}

      {/* Moved Character Workflow Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8"> {/* Added grid for layout consistency */}
        <div className="card-creative p-6 flex flex-col items-center">
          <span className="text-5xl mb-4">🧑‍🎤</span>
          <h2 className="text-xl font-semibold mb-2">Character Workflow</h2>
          <p className="text-gray-600 mb-4 text-center">
            Start a new character creation workflow to flesh out your ideas before adding them to a project.
          </p>
          <button
            className="btn-creative w-full text-center"
            onClick={() => navigate("/character-workflow")}
          >
            Start Character Workflow
          </button>
        </div>
        {/* Add other workflow cards here in the future */}
      </div>


      {/* Moved Character Workflow List */}
      <CharacterWorkflowList />
    </div>
  );
}

export default Workflows;