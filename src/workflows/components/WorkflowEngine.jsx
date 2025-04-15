import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { doc, getDocs, setDoc, collection, Timestamp, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { db } from '../../services/firebase'; // Adjusted path assuming firebase.js is in src/services
// import WorkflowSection from './WorkflowSection'; // No longer needed directly here
import QuestionCard from './QuestionCard'; // Import QuestionCard

const WorkflowEngine = ({ config, workflowId, projectId, isViewMode = false }) => { // Accept isViewMode prop
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved', 'error'
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Initialize to 0, will adjust after fetch
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Track initial answer load

  // Fetch existing answers
  useEffect(() => {
    if (!workflowId) {
      setIsLoading(false);
      setError("Workflow ID is missing.");
      return;
    }

    const fetchAnswers = async () => {
      setIsLoading(true);
      setError(null);
      setAnswers({}); // Reset answers on new workflowId

      try {
        const answersCollectionRef = collection(db, 'characterWorkflows', workflowId, 'answers');
        const querySnapshot = await getDocs(answersCollectionRef);
        const initialAnswers = {};
        querySnapshot.forEach((doc) => {
          // Assuming the answer value is stored in a 'value' field
          initialAnswers[doc.id] = doc.data()?.value;
        });
        setAnswers(initialAnswers);

        // Calculate the starting step index after answers are loaded
        const isNewWorkflow = Object.keys(initialAnswers).length === 0;

        if (isViewMode) {
             // In view mode, start at the first actual content step (skip intro)
             const firstContentStepIndex = steps.findIndex(s => s.type === 'question');
             // If no question steps exist (only intro?), default to 0
             setCurrentStepIndex(firstContentStepIndex >= 0 ? firstContentStepIndex : 0);
        } else if (isNewWorkflow) {
            // For a new workflow, always start at the beginning (index 0, which is intro if it exists)
            setCurrentStepIndex(0);
        } else {
            // For resuming, find the first unanswered question
            let firstUnansweredIndex = -1;
            for (let i = 0; i < steps.length; i++) {
                if (steps[i].type === 'question') {
                    if (!initialAnswers[steps[i].questionConfig.id]) {
                        firstUnansweredIndex = i;
                        break;
                    }
                }
            }
            // If all answered, go to the first step (intro or first question).
            // If some unanswered, go there.
            const startingIndex = firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0;
            setCurrentStepIndex(startingIndex);
        }
        setInitialLoadComplete(true); // Mark initial load as complete

      } catch (err) {
        console.error("Error fetching answers:", err);
        setError("Failed to load workflow answers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [workflowId]); // Re-run effect if workflowId changes

  // Save a single answer to Firestore and update workflow name if applicable
  const saveAnswer = useCallback(async (questionId, value) => {
    if (!workflowId || !questionId) {
        console.warn("Missing workflowId or questionId, cannot save.");
        return;
    };
    setSaveStatus('saving');
    try {
      // Save the individual answer to the subcollection
      const answerRef = doc(db, 'characterWorkflows', workflowId, 'answers', questionId);
      await setDoc(answerRef, {
        value: value,
        lastUpdated: Timestamp.now()
      }, { merge: true });

      // If this is the 'name' question, update the parent workflow document's name
      if (questionId === 'name') {
        const workflowRef = doc(db, 'characterWorkflows', workflowId);
        await updateDoc(workflowRef, {
          name: value || 'Untitled Character Workflow' // Use fallback if value is empty
        });
        // Note: We might need to trigger a refresh of the workflow list on the /workflows page
        // if we want the name change to reflect there immediately without a manual refresh.
        // This can be handled later with state management or callbacks if needed.
      }

      setSaveStatus('saved');
      // Optional: Reset status after a delay
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (err) {
      console.error("Error saving answer or workflow name:", err);
      setError(`Failed to save answer for ${questionId}`);
      setSaveStatus('error');
       // Optional: Reset status after a delay even on error
       setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [workflowId]); // Include workflowId in dependency array

  // Handle changes from QuestionCard (or other input components)
  const handleAnswerChange = useCallback((questionId, value) => {
    // Update local state immediately for responsiveness
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: value
    }));
    // Trigger the save operation (debouncing will happen in QuestionCard)
    saveAnswer(questionId, value);
  }, [saveAnswer]); // Include saveAnswer in dependency array

  // Calculate flattened steps
  const steps = useMemo(() => {
    if (!config) return []; // Return empty array if config is not loaded yet

    const calculatedSteps = [];
    // Step 0: Introduction
    if (config.introduction) {
      calculatedSteps.push({ type: 'intro', content: config.introduction });
    }
    // Add sections and questions
    config.sections?.forEach((section, sectionIndex) => {
      // Optional: Add step for section title
      // calculatedSteps.push({ type: 'sectionTitle', title: section.title, sectionIndex });
      section.questions.forEach((question, questionIndex) => {
        calculatedSteps.push({
          type: 'question',
          sectionIndex,
          questionIndex,
          questionConfig: question,
        });
      });
    });
    // Optional: Add a final summary/completion step
    // calculatedSteps.push({ type: 'completion' });
    return calculatedSteps;
  }, [config]);

  const totalSteps = steps.length;

  // Navigation Handlers
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNext = async () => { // Make async for final save/update
    // Ensure autosave completes for the current step if it's a question
    const currentStep = steps[currentStepIndex];
    if (currentStep.type === 'question') {
       const answer = answers[currentStep.questionConfig.id];
       // Trigger save immediately
       await saveAnswer(currentStep.questionConfig.id, answer || ''); // Await the save
       // Clear any pending debounce to avoid double saves
       // (This needs to be handled within QuestionCard or via callback if debounce is active)
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Handle workflow completion
      console.log("Workflow finished!");
      try {
        // Mark workflow as complete in Firestore
        const workflowRef = doc(db, 'characterWorkflows', workflowId);
        await updateDoc(workflowRef, {
          completed: true,
          completedAt: Timestamp.now() // Optional: add completion timestamp
        });
        // Navigate back to the workflows list page
        navigate('/workflows');
      } catch (err) {
        console.error("Error marking workflow as complete:", err);
        setError("Failed to mark workflow as complete.");
        // Optionally show a notification
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1); // Decrement index
    }
  };


  // Render Logic
  // Wait for initial answer load AND step calculation before rendering main content
  if (isLoading || !initialLoadComplete) {
    // Skeleton Loader for the workflow engine
    return (
      <div className="workflow-engine-skeleton p-4 md:p-6 animate-pulse">
        {/* Skeleton for Navigation (optional, could be simpler) */}
        <div className="navigation-controls mb-4 pt-2 flex justify-between items-center">
           <div className="h-8 bg-gray-300 rounded w-20"></div>
           <div className="h-4 bg-gray-300 rounded w-16"></div>
           <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
         {/* Skeleton for Question Card */}
         <div className="flex flex-col items-center p-4 border rounded-lg shadow-md"> {/* Mimic card */}
            {/* Image Placeholder */}
            <div className="flex justify-center h-60 md:h-80 mb-6 w-full bg-gray-300 rounded-md"></div>
            {/* Question Box Placeholder */}
            <div className="w-full max-w-lg text-center">
                {/* Prompt Placeholder */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
                {/* Input Placeholder */}
                <div className="h-24 bg-gray-300 rounded w-full mb-4"></div>
                {/* AI Button Placeholder */}
                <div className="h-8 bg-gray-300 rounded w-32"></div>
            </div>
         </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

   if (!config) {
      return <div className="text-orange-600">Workflow configuration not loaded.</div>;
  }

  // Get the current step based on the index
  const currentStep = steps[currentStepIndex];

  // Determine button visibility and text
  const showPrevious = currentStepIndex > 0;
  const showNext = currentStepIndex < totalSteps - 1;
  const nextButtonText = showNext ? "Next" : "Finish"; // Change text on the last step

  // Render View Mode Layout
  if (isViewMode) {
    // Filter steps to only include questions for the Q&A list
    const questionSteps = steps.filter(step => step.type === 'question');

    return (
      <div className="workflow-view p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{config.title}</h1> {/* Removed " - View" */}

        {/* Placeholder for AI Generated Profile */}
        <div className="mb-8 p-4 border border-dashed border-gray-400 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">AI Generated Character Profile</h2>
          <p className="text-gray-500 italic">(Placeholder: AI profile based on answers will appear here after completion.)</p>
          {/* TODO: Add logic later to fetch/display actual AI profile if it exists */}
        </div>

        {/* Collapsible Section for Answers */}
        <details className="mb-4 bg-white rounded-lg shadow p-4">
            <summary className="cursor-pointer font-semibold text-lg text-creative-purple-700 hover:underline list-none flex justify-between items-center">
                <span>View Your Answers ({questionSteps.length} questions)</span>
                <span className="text-xl">▼</span> {/* Basic indicator */}
            </summary>
            {/* Make this div scrollable if it gets too long */}
            <div className="mt-4 space-y-6 border-t pt-4 max-h-[60vh] overflow-y-auto">
                {questionSteps.map(step => (
                     <div key={step.questionConfig.id} className="qna-item mb-4 pb-4 border-b last:border-b-0">
                        {/* Optional: Render Image */}
                        {step.questionConfig.image && (
                             <div className="flex justify-center max-h-60 mb-4 w-full">
                                <img
                                    src={`/assets/workflows/character-builder/${step.questionConfig.image}`}
                                    alt={step.questionConfig.prompt}
                                    className="object-contain max-w-full max-h-full rounded-md"
                                />
                            </div>
                        )}
                        {/* Question Prompt */}
                        <p className="font-semibold text-gray-800 mb-2">{step.questionConfig.prompt}</p>
                        {/* Answer */}
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded min-h-[3em]"> {/* Added min-height */}
                            {answers[step.questionConfig.id] || <span className="text-gray-400 italic">No answer provided</span>}
                        </p>
                    </div>
                ))}
                 {questionSteps.length === 0 && !isLoading && (
                     <p className="text-gray-500 italic">No questions found in this workflow configuration.</p>
                 )}
            </div>
        </details>
      </div>
    );
  }

  // Render Edit/Resume Mode Layout
  return (
    // Reduce top padding (pt-4 md:pt-6 -> pt-2 md:pt-3), keep others
    <div className="workflow-engine px-4 md:px-6 pb-4 md:pb-6 pt-2 md:pt-3 flex flex-col">
       {/* Save Status */}
       <div className="save-status text-sm text-gray-500 mb-2 h-5 self-end">
         {saveStatus === 'saving' && 'Saving...'}
         {saveStatus === 'saved' && 'Saved.'}
         {saveStatus === 'error' && <span className="text-red-500">Save Error!</span>}
       </div>

       {/* Navigation Buttons - Placed ABOVE the main content area */}
       {totalSteps > 0 && !isViewMode && currentStep?.type !== 'intro' && ( // Show only on question steps
         <div className="navigation-controls mb-4 pt-2 flex justify-between items-center">
           <button
             onClick={handlePrevious}
             // Disable if it's the first question (index 0 or 1 depending on intro)
             disabled={currentStepIndex === (config?.introduction ? 1 : 0)}
             className={`btn-secondary disabled:opacity-50`}
           >
             Previous
           </button>
           <span className="text-sm text-gray-500">
              {/* Adjust step count display */}
              Step {currentStepIndex + (config.introduction ? 0 : 1)} of {totalSteps - (config.introduction ? 1 : 0)}
           </span>
           <button
             onClick={handleNext}
             className={`btn-creative disabled:opacity-50`}
           >
             {nextButtonText}
           </button>
         </div>
       )}

      {/* Main Content Area (Intro or QuestionCard) */}
      <div className="workflow-content mb-4"> {/* Removed flex-grow and overflow */}
        {currentStep?.type === 'intro' && (
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{config.title}</h1>
            <p className="text-gray-700">{currentStep.content}</p>
             {/* Add a 'Start' or 'Next' button specifically for the intro step */}
             <div className="mt-6 text-right">
                 <button onClick={handleNext} className="btn-creative">
                     Start Workflow
                 </button>
             </div>
          </div>
        )}

        {currentStep?.type === 'question' && (
          <QuestionCard
            key={currentStep.questionConfig.id}
            questionConfig={currentStep.questionConfig}
            currentAnswer={answers[currentStep.questionConfig.id] || ''}
            onAnswerChange={handleAnswerChange}
            workflowId={workflowId}
            projectId={projectId}
            isViewMode={isViewMode} // False here
            config={config} // Pass config for potential use (e.g., checking intro existence)
            // REMOVED Nav Props from here
          />
        )}
         {!currentStep && totalSteps > 0 && (
             <div>Loading step...</div>
         )}
         {!currentStep && totalSteps === 0 && !isLoading && (
             <div>No steps defined in this workflow.</div>
         )}
      </div>

      {/* Navigation Buttons REMOVED from bottom */}

    </div>
  );
};

export default WorkflowEngine;