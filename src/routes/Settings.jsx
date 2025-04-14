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
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPreferences();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!preferences.name.trim()) return;

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
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-600">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Preferences</h1>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Preferences</h2>
        {preferences.name || preferences.role || preferences.preferredTone || preferences.defaultGenre ? (
          <div className="space-y-1 text-gray-600">
            <p>Name: {preferences.name || 'Not set'}</p>
            <p>Role: {preferences.role || 'Not set'}</p>
            <p>AI Tone: {preferences.preferredTone || 'Not set'}</p>
            <p>Default Genre: {preferences.defaultGenre || 'Not set'}</p>
          </div>
        ) : (
          <p className="text-gray-600">No preferences saved yet.</p>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={preferences.name}
            onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Creative Role
          </label>
          <select
            value={preferences.role}
            onChange={(e) => setPreferences({ ...preferences, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a role...</option>
            <option value="screenwriter">Screenwriter</option>
            <option value="novelist">Novelist</option>
            <option value="songwriter">Songwriter</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Preferred AI Tone
          </label>
          <select
            value={preferences.preferredTone}
            onChange={(e) => setPreferences({ ...preferences, preferredTone: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a tone...</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Default Genre or Style
          </label>
          <input
            type="text"
            value={preferences.defaultGenre}
            onChange={(e) => setPreferences({ ...preferences, defaultGenre: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., Science Fiction, Pop Music, Drama"
          />
        </div>

        <div className="pt-4 space-x-4">
          <button
            type="submit"
            disabled={!preferences.name.trim() || saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
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
          <button
            type="button"
            onClick={() => {
              setPreferences(defaultPreferences);
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 3000);
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Reset Form
          </button>
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
                console.error('Error clearing preferences:', error);
              } finally {
                setClearing(false);
              }
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
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
