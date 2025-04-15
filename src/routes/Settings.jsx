import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Settings() {
  const defaultPreferences = {
    name: '',
    role: '',
    preferredTone: '',
    defaultGenre: ''
  };

  const [preferences, setPreferences] = useState({
    name: '',
    role: '',
    preferredTone: '',
    defaultGenre: ''
  });
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const docRef = doc(db, 'users', 'defaultUser', 'preferences', 'profile');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPreferences(docSnap.data());
        }
      } catch (error) {
        alert('Error fetching preferences.');
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!preferences.name.trim()) newErrors.name = "Name is required.";
    if (preferences.name.length > 50) newErrors.name = "Name must be under 50 characters.";
    if (preferences.defaultGenre.length > 50) newErrors.defaultGenre = "Genre must be under 50 characters.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', 'defaultUser', 'preferences', 'profile'), {
        name: preferences.name.trim(),
        role: preferences.role.trim(),
        preferredTone: preferences.preferredTone.trim(),
        defaultGenre: preferences.defaultGenre.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert('Error saving preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        {/* Use new text color */}
        <div className="text-text-secondary">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Use new text color */}
      <h1 className="text-2xl font-bold text-text-primary mb-6">User Preferences</h1>

      {/* Use new card background and text colors */}
      <div className="bg-card-bg p-4 rounded-lg mb-6 border border-accent-cream/30">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Current Preferences</h2>
        {preferences.name || preferences.role || preferences.preferredTone || preferences.defaultGenre ? (
          <div className="space-y-1 text-text-secondary">
            <p>Name: {preferences.name || 'Not set'}</p>
            <p>Role: {preferences.role || 'Not set'}</p>
            <p>AI Tone: {preferences.preferredTone || 'Not set'}</p>
            <p>Default Genre: {preferences.defaultGenre || 'Not set'}</p>
          </div>
        ) : (
          <p className="text-text-secondary">No preferences saved yet.</p>
        )}
      </div>

      {saveSuccess && (
        // Use new success status colors
        <div className="bg-status-success/20 border border-status-success text-status-success px-4 py-2 rounded mb-4">
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Name
          </label>
          {/* Use .input-creative and new error border color */}
          <input
            type="text"
            value={preferences.name}
            onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
            className={`input-creative ${errors.name ? "border-status-error" : "border-accent-cream/50"}`}
            required
          />
          {/* Use new error text color */}
          {errors.name && <div className="text-status-error text-xs mt-1">{errors.name}</div>}
        </div>

        <div>
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Creative Role
          </label>
          {/* Use .input-creative */}
          <select
            value={preferences.role}
            onChange={(e) => setPreferences({ ...preferences, role: e.target.value })}
            className="input-creative"
          >
            <option value="">Select a role...</option>
            <option value="screenwriter">Screenwriter</option>
            <option value="novelist">Novelist</option>
            <option value="songwriter">Songwriter</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Preferred AI Tone
          </label>
          {/* Use .input-creative */}
          <select
            value={preferences.preferredTone}
            onChange={(e) => setPreferences({ ...preferences, preferredTone: e.target.value })}
            className="input-creative"
          >
            <option value="">Select a tone...</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Default Genre or Style
          </label>
          {/* Use .input-creative and new error border color */}
          <input
            type="text"
            value={preferences.defaultGenre}
            onChange={(e) => setPreferences({ ...preferences, defaultGenre: e.target.value })}
            className={`input-creative ${errors.defaultGenre ? "border-status-error" : "border-accent-cream/50"}`}
            placeholder="e.g., Science Fiction, Pop Music, Drama"
          />
          {/* Use new error text color */}
          {errors.defaultGenre && <div className="text-status-error text-xs mt-1">{errors.defaultGenre}</div>}
        </div>

        <div className="pt-4 space-x-4">
          {/* Use .btn-creative */}
          <button
            type="submit"
            disabled={!preferences.name.trim() || saving || Object.keys(errors).length > 0}
            className="btn-creative"
          >
            {saving ? (
              <svg className="animate-spin h-5 w-5 inline-block mr-2" viewBox="0 0 24 24">
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
            ) : (
              "Save Preferences"
            )}
          </button>
          {/* Use .btn-creative-secondary */}
          <button
            type="button"
            onClick={() => {
              setPreferences(defaultPreferences);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            }}
            className="btn-creative-secondary"
          >
            Reset Form
          </button>
          {/* Use .btn-creative-secondary */}
          <button
            type="button"
            onClick={async () => {
              setClearing(true);
              try {
                const docRef = doc(db, 'users', 'defaultUser', 'preferences', 'profile');
                await deleteDoc(docRef);
                setPreferences(defaultPreferences);
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              } catch (error) {
                alert('Error clearing preferences.');
              } finally {
                setClearing(false);
              }
            }}
            className="btn-creative-secondary"
            disabled={clearing}
          >
            {clearing ? (
              <svg className="animate-spin h-5 w-5 inline-block mr-2" viewBox="0 0 24 24">
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
            ) : (
              "Clear Preferences"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
