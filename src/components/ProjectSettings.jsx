import React from "react";

export default function ProjectSettings() {
  return (
    <div>
      {/* Use text-text-primary (updated via index.css) */}
      <h2 className="text-2xl font-bold text-gradient mb-6">Project Settings</h2>
      {/* Use .card-creative */}
      <div className="card-creative p-8 max-w-xl mx-auto">
        <div className="mb-6">
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Project Theme (placeholder)
          </label>
          {/* Use .input-creative */}
          <select className="input-creative w-full">
            <option>Default</option>
            {/* Remove old theme options if necessary */}
            {/* <option>Purple</option> */}
            {/* <option>Blue</option> */}
            <option>Dark</option>
          </select>
        </div>
        <div className="mb-6">
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Notifications (placeholder)
          </label>
          {/* Style checkbox with accent color */}
          <input type="checkbox" className="mr-2 rounded text-accent-orange focus:ring-accent-orange" /> Enable notifications
        </div>
        <div className="mb-6">
          {/* Use new text color */}
          <label className="block text-text-primary text-sm font-bold mb-2">
            Project Visibility (placeholder)
          </label>
          {/* Use .input-creative */}
          <select className="input-creative w-full">
            <option>Private</option>
            <option>Public</option>
          </select>
        </div>
        {/* Use new text color */}
        <div className="text-text-secondary text-sm">
          (More project-specific settings coming soon.)
        </div>
      </div>
    </div>
  );
}
