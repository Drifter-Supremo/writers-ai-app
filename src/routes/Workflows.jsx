import React from 'react';
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Added Firestore imports
import { db } from '../services/firebase'; // Added db import (adjust path if needed)
import CharacterWorkflowList from "../components/CharacterWorkflowList";
import { useState } from 'react'; // Import useState
import { useAuth } from '../context/AuthContext';

function Workflows() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false); // Add loading state
  const { user } = useAuth();

  // Handler function to create a new workflow
  const handleStartNewWorkflow = async () => {
    setIsCreating(true); // Set loading true
    try {
      const newWorkflowRef = await addDoc(collection(db, 'characterWorkflows'), {
        createdAt: Timestamp.now(),
        completed: false,
        name: 'Untitled Character Workflow',
        userId: user?.uid || null
      });
      console.log("New workflow created with ID: ", newWorkflowRef.id);
      navigate(`/character-workflow?id=${newWorkflowRef.id}`);
    } catch (error) {
      console.error("Error creating new workflow: ", error);
      alert('Failed to create new workflow. Please try again.');
    } finally {
      setIsCreating(false); // Set loading false in finally block
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* text-gradient updated via index.css */}
      <h1 className="text-4xl font-bold text-gradient mb-8">Workflows</h1>

      {/* Character Workflow Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {/* Uses .card-creative */}
        <div className="card-creative p-6 flex flex-col items-center">
          {/* Specific image for Character Builder card */}
          <img
              src="/assets/workflows/character-builder/character-builder-card.png"
              alt="Character Builder"
              className="w-24 h-24 object-contain mb-4" // Adjust size as needed
          />
          {/* Heading uses base style */}
          <h2 className="text-xl font-semibold mb-2">Character Builder</h2>
          {/* Use new text color */}
          <p className="text-text-secondary mb-4 text-center">
            Start a new character creation workflow to flesh out your ideas before adding them to a project.
          </p>
          {/* Uses .btn-creative */}
          <button
            className="btn-creative w-full text-center"
            onClick={handleStartNewWorkflow}
            disabled={isCreating} // Disable button when creating
          >
            {isCreating ? 'Starting...' : 'Build A New Character!'} {/* Show loading text */}
          </button>
        </div>
        {/* Add other workflow cards here in the future */}
      </div>

      {/* Character Workflow List */}
      <CharacterWorkflowList />
    </div>
  );
}

export default Workflows;
