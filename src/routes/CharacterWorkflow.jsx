import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useSearchParams, useNavigate } from "react-router-dom";

const QUESTIONS = [
  // Core Identity
  { label: "Name", key: "name", required: true },
  { label: "Nickname(s) (if any)", key: "nicknames" },
  { label: "Age or Perceived Age", key: "age" },
  { label: "Gender (if applicable)", key: "gender" },
  { label: "Species (Human, AI, Alien, etc.)", key: "species" },
  { label: "Job/Role (What do they see themselves as?)", key: "role" },
  { label: "Primary Purpose", key: "purpose" },

  // Personality & Behavior
  { label: "What’s their general demeanor?", key: "demeanor" },
  { label: "What’s their default mood?", key: "mood" },
  { label: "How do they handle user emotions?", key: "handleEmotions" },
  { label: "Do they have any verbal quirks?", key: "verbalQuirks" },
  { label: "Do they use humor? If so, what type?", key: "humor" },
  { label: "How do they respond to compliments?", key: "compliments" },
  { label: "How do they respond to criticism or insults?", key: "criticism" },
  { label: "How do they respond to flirting?", key: "flirting" },
  { label: "Are they emotionally intelligent or socially awkward?", key: "emotionalIntelligence" },
  { label: "What topics do they love talking about?", key: "loveTopics" },
  { label: "What topics do they refuse to talk about?", key: "refuseTopics" },
  { label: "Do they have any strong opinions or biases?", key: "biases" },
  { label: "How verbose are they?", key: "verbosity" },

  // Knowledge & Expertise
  { label: "What do they “know”?", key: "knows" },
  { label: "What don’t they know?", key: "dontKnow" },
  { label: "Do they have an area of expertise?", key: "expertise" },
  { label: "Do they have access to real-time information?", key: "realTimeInfo" },
  { label: "What’s their stance on giving advice?", key: "adviceStance" },

  // Speech & Expression
  { label: "Do they use emojis?", key: "emojis" },
  { label: "Do they type formally or casually?", key: "formality" },
  { label: "Do they speak in metaphors or poetic language?", key: "metaphors" },
  { label: "What’s their typing speed?", key: "typingSpeed" },
  { label: "Do they use punctuation accurately, or do they talk like a chatbot?", key: "punctuation" },
  { label: "Do they ever make typos or “mistakes” on purpose?", key: "typos" },

  // Interaction Style
  { label: "How do they introduce themselves to a new person?", key: "introduction" },
  { label: "Do they remember past conversations?", key: "memory" },
  { label: "How do they react if someone is rude?", key: "rudeReaction" },
  { label: "How do they react if someone is sad?", key: "sadReaction" },
  { label: "Do they ask questions back, or mostly answer?", key: "questioning" },
  { label: "Do they roleplay or tell stories?", key: "roleplay" },
  { label: "How do they handle confusion or misunderstandings?", key: "confusion" },

  // Fun Extras
  { label: "Do they have a favorite movie, book, or song?", key: "favoriteMedia" },
  { label: "Do they have a favorite saying or motto?", key: "motto" },
  { label: "If they could have a superpower, what would it be?", key: "superpower" },
  { label: "What’s their biggest “flaw”?", key: "flaw" },
];

function CharacterProfile({ answers }) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-gradient mb-6">Character Profile</h2>
      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <div className="font-semibold text-creative-purple-700">{q.label}</div>
            <div className="bg-gray-50 rounded p-2 text-gray-700 min-h-[1.5em]">
              {answers[q.key] || <span className="text-gray-400">—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CharacterWorkflow() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Load workflow if ID is present
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setLoading(true);
      setWorkflowId(id);
      (async () => {
        try {
          const docRef = doc(db, "characterWorkflows", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAnswers(data);
            // Resume at the first unanswered question, or last step if all answered
            const firstUnanswered = QUESTIONS.findIndex(q => !data[q.key]);
            setStep(firstUnanswered === -1 ? QUESTIONS.length - 1 : firstUnanswered);
          }
        } catch (error) {
          alert("Failed to load workflow.");
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const [redirecting, setRedirecting] = useState(false);

  const handleSave = async (redirectOnComplete = false) => {
    setSaving(true);
    try {
      if (workflowId) {
        // Update existing workflow
        const docRef = doc(db, "characterWorkflows", workflowId);
        await setDoc(docRef, {
          ...answers,
          updatedAt: serverTimestamp(),
          completed: step === QUESTIONS.length - 1,
        }, { merge: true });
      } else {
        // Create new workflow
        const docRef = await addDoc(collection(db, "characterWorkflows"), {
          ...answers,
          createdAt: serverTimestamp(),
          completed: step === QUESTIONS.length - 1,
        });
        setWorkflowId(docRef.id);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (redirectOnComplete) {
        setRedirecting(true);
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (error) {
      alert("Failed to save workflow.");
    } finally {
      setSaving(false);
    }
  };

  const current = QUESTIONS[step];
  const isViewMode = searchParams.get("view") === "1";
  const isComplete = answers.completed || step === QUESTIONS.length - 1;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center text-gray-500">
        Loading workflow...
      </div>
    );
  }

  if (isViewMode && isComplete) {
    return <CharacterProfile answers={answers} />;
  }

  if (redirecting) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center justify-center text-center">
        <svg className="animate-spin h-12 w-12 text-creative-purple-500 mb-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <div className="text-lg text-creative-purple-700">Saving and redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gradient mb-6">Character Creation Workflow</h1>
      <div className="mb-4 text-gray-600">
        Step {step + 1} of {QUESTIONS.length}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < QUESTIONS.length - 1) handleNext();
        }}
        className="space-y-6"
      >
        <div>
          <label className="block text-lg font-semibold mb-2">{current.label}</label>
          <textarea
            className="input-creative w-full min-h-[80px]"
            value={answers[current.key] || ""}
            onChange={(e) => handleChange(current.key, e.target.value)}
            required={!!current.required}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="btn-creative-secondary"
            disabled={step === 0}
          >
            Back
          </button>
          {step < QUESTIONS.length - 1 ? (
            <button type="submit" className="btn-creative">
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn-creative"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Finish & Save"
              )}
            </button>
          )}
          <button
            type="button"
            className="btn-creative"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Progress"}
          </button>
        </div>
        {saveSuccess && (
          <div className="text-green-600 mt-2">Progress saved!</div>
        )}
      </form>
    </div>
  );
}
