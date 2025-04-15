import React from 'react';

const AIHelperModal = ({ isOpen, onClose, prompt }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      onClick={onClose} // Close modal when clicking the backdrop
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <h3 className="text-xl font-semibold mb-4">AI Helper</h3>
        <p className="mb-4 text-gray-600">
          Prompt: "{prompt}"
        </p>
        <p className="text-center text-gray-500 italic my-4">
          (AI chat interface will appear here)
        </p>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400" // Basic secondary button styling
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIHelperModal;