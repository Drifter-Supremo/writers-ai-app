import React, { useState, useEffect, useCallback, useRef } from 'react';
import AIHelperModal from './AIHelperModal'; // Import the modal

function QuestionCard({
  questionConfig,
  currentAnswer,
  onAnswerChange,
  workflowId,
  projectId,
  isViewMode = false,
  // REMOVED Navigation Props
  config // Pass down the main config to check for introduction presence
}) {
  const { id, prompt, type, image, aiEnabled } = questionConfig;
  // Manage input state only if not in view mode
  const [inputValue, setInputValue] = useState(currentAnswer || '');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const debounceTimeoutRef = useRef(null);

  // Debounced save function
  const debouncedOnAnswerChange = useCallback((id, value) => {
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      onAnswerChange(id, value); // Call the actual save function passed via props
    }, 1000); // Adjust debounce delay (in ms) as needed, e.g., 1000ms = 1 second
  }, [onAnswerChange]); // Dependency: the prop function itself

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue); // Update local state immediately
    debouncedOnAnswerChange(questionConfig.id, newValue); // Call the debounced function
  };

  const handleAiButtonClick = () => {
    setIsAiModalOpen(true); // Open the modal
  };

  const handleBlur = () => {
    // Clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Call the save function immediately if the value has changed
    // (Optional: Check if inputValue !== currentAnswer before calling to avoid unnecessary saves)
    onAnswerChange(questionConfig.id, inputValue);
  };

  const imagePath = image ? `/assets/workflows/character-builder/${image}` : null;

  return (
    // Use flex-col and ensure card takes up available height if needed, or has min-height
    <div className="flex flex-col items-center p-4 card-creative min-h-[70vh]"> {/* Added min-height to card */}
      {/* Image Area */}
      {imagePath && (
        <div className="flex justify-center max-h-80 mb-6 w-full flex-shrink-0"> {/* Prevent image area from shrinking */}
          <img
            src={imagePath}
            alt={prompt || 'Workflow question image'}
            className="object-contain max-w-full max-h-full rounded-md"
          />
        </div>
      )}

      {/* Question/Input Area - Allow this to grow */}
      <div className="w-full max-w-lg text-center flex flex-col flex-grow mb-4">
        {/* Use new text color */}
        <label htmlFor={`question-${id}`} className="block text-lg font-semibold mb-3 text-text-primary flex-shrink-0">
          {prompt}
        </label>

        {/* Input Area - Allow textarea to grow */}
        <div className="input-area w-full flex-grow">
          {isViewMode ? (
            // Use new dark theme colors for view mode
            <div className="text-left p-3 bg-primary-bg rounded-md w-full min-h-[6rem] whitespace-pre-wrap text-text-secondary">
              {currentAnswer || <span className="text-text-secondary/70 italic">No answer provided</span>}
            </div>
          ) : (
            // ALWAYS render textarea for consistent behavior and wrapping
            <textarea
              id={`question-${id}`}
              value={inputValue}
              onChange={handleInputChange}
              // Use .input-creative
              className="input-creative w-full p-3 border-2 rounded-lg min-h-[6rem]"
              // Rows attribute primarily suggests initial height but doesn't fix it like min-height
              rows={type === 'textarea' ? 4 : 2}
              onBlur={handleBlur}
              style={{ resize: 'vertical' }} // Allow vertical resize by user
            />
          )}
        </div>

        {/* Action Area (AI Button ONLY) */}
        {!isViewMode && aiEnabled && (
          // Position AI button below input
          <div className="action-area mt-4 w-full max-w-lg flex justify-start">
              {/* Use .btn-creative-secondary */}
              <button
                type="button"
                onClick={handleAiButtonClick}
                className="btn-creative-secondary text-sm"
              >
                ✨ Need AI Help?
              </button>
          </div>
        )}
      </div> {/* End of Question Box Area */}


      {/* Render AI Helper Modal Conditionally (only if not in view mode) */}
      {!isViewMode && (
        <AIHelperModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)} // Function to close the modal
          prompt={prompt} // Pass the question prompt
          // context={...} // Pass relevant context if needed later
          workflowId={workflowId} // Pass workflowId
          projectId={projectId} // Pass projectId
          questionId={id} // Pass questionId
        />
      )}
    </div>
  );
}

export default QuestionCard;