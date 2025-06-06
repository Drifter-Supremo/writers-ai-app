import React, { useState } from "react";

export default function ProjectOverview({ project, onSave }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    tags: project?.tags?.join(", ") || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        // Use .card-creative and new text colors
        <form onSubmit={handleSave} className="card-creative p-8 max-w-2xl mb-8 break-words">
          <div className="space-y-4">
            <div>
              {/* Use new text colors */}
              <label className="block text-text-primary text-sm font-bold mb-2">
                Project Name
              </label>
              {/* Use .input-creative */}
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-creative"
                required
              />
            </div>
            <div>
               {/* Use new text colors */}
              <label className="block text-text-primary text-sm font-bold mb-2">
                Description
              </label>
               {/* Use .input-creative */}
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-creative"
                rows="3"
                required
              />
            </div>
            <div>
               {/* Use new text colors */}
              <label className="block text-text-primary text-sm font-bold mb-2">
                Tags (comma-separated)
              </label>
               {/* Use .input-creative */}
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="input-creative"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div className="flex gap-2">
              {/* Use .btn-creative */}
              <button
                type="submit"
                className="btn-creative"
                disabled={saving}
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
                  "Save Changes"
                )}
              </button>
              {/* Use .btn-creative-secondary */}
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-creative-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        // Use .card-creative
        <div className="card-creative p-8 max-w-2xl mb-8 break-words">
          <div className="flex justify-between items-start mb-6">
            {/* Use new text colors, remove text-gradient */}
            <h1 className="text-3xl font-bold text-text-primary break-words max-w-full">{project.name}</h1>
            {/* Use new text colors for edit button */}
            <button
              onClick={() => setEditing(true)}
              className="text-accent-orange hover:text-accent-orange-hover transition-colors duration-200"
            >
              ✏️ Edit
            </button>
          </div>
          {/* Use new text colors */}
          <p className="text-text-secondary mb-6 leading-relaxed">{project.description}</p>
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                // Use .tag-creative
                <span
                  key={index}
                  className="tag-creative"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Use new text colors */}
    </div>
  );
}
