import React, { useState } from "react";

export default function ProjectNotes({ onAddNote }) {
  const [note, setNote] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold text-gradient mb-6">Notes</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (note.trim()) {
            onAddNote(note);
            setNote("");
          }
        }}
        className="mb-6"
      >
        <textarea
          className="input-creative w-full min-h-[100px] mb-2"
          placeholder="Write a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="submit"
          className="btn-creative"
          disabled={!note.trim()}
        >
          Add Note
        </button>
      </form>
      <div className="text-gray-400 text-sm">
        (Rich text editor coming soon. This is a simple note input for now.)
      </div>
    </div>
  );
}
