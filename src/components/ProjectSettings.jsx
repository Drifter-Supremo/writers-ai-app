import React from "react";

export default function ProjectSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gradient mb-6">Project Settings</h2>
      <div className="card-creative p-8 max-w-xl mx-auto">
        <div className="mb-6">
          <label className="block text-creative-purple-900 text-sm font-bold mb-2">
            Project Theme (placeholder)
          </label>
          <select className="input-creative w-full">
            <option>Default</option>
            <option>Purple</option>
            <option>Blue</option>
            <option>Dark</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-creative-purple-900 text-sm font-bold mb-2">
            Notifications (placeholder)
          </label>
          <input type="checkbox" className="mr-2" /> Enable notifications
        </div>
        <div className="mb-6">
          <label className="block text-creative-purple-900 text-sm font-bold mb-2">
            Project Visibility (placeholder)
          </label>
          <select className="input-creative w-full">
            <option>Private</option>
            <option>Public</option>
          </select>
        </div>
        <div className="text-gray-400 text-sm">
          (More project-specific settings coming soon.)
        </div>
      </div>
    </div>
  );
}
