import React, { useState, useEffect, useRef } from "react"; // Removed useCallback
import RichTextEditor from "./RichTextEditor";

export default function ProjectNotes({
  notes = [],
  loadingNotes = false,
  onSaveNote, // Renamed from onAddNote/onEditNote
  onDeleteNote, // required for delete button to work
}) {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [editingNote, setEditingNote] = useState(null); // Holds the full note object being edited, or null
  const [deletingNoteId, setDeletingNoteId] = useState(null); // Track which note is being deleted
  const deleteTimeoutRef = useRef(null); // Ref to hold delete animation timeout ID

  // Cleanup delete timeout on unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  // Handle clicking a note to edit
  function handleNoteClick(note) {
    setEditingNote(note); // Store the whole note object
    setNoteTitle(note.title || "");
    setNoteContent(note.content || "");
  }

  // Handle content change from RichTextEditor
  const handleContentChange = (newContent) => {
    setNoteContent(newContent);
    // No debounced save here anymore
  };

  // Handle cancel edit
  function handleCancelEdit() {
    setEditingNote(null); // Clear the editing state
    setNoteTitle("");
    setNoteContent("");
  }

  // Handle save (unified for add and edit)
  function handleSaveNote(e) {
    e.preventDefault();

    const noteData = {
      title: noteTitle ?? "",
      content: noteContent ?? "",
    };

    // Call the single save handler passed from parent
    // Pass the ID if we are editing, otherwise pass null/undefined
    onSaveNote(editingNote ? editingNote.id : null, noteData);

    // Reset form and editing state after save
    setEditingNote(null);
    setNoteTitle("");
    setNoteContent("");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Notes</h2>

      {/* Note Editor Form */}
      <form onSubmit={handleSaveNote} className="mb-6">
        <input
          type="text"
          className="input-creative min-h-[44px] mb-3"
          placeholder="Note title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)} // Simplified onChange
        />
        <RichTextEditor
          content={noteContent}
          onChange={handleContentChange} // Simplified onChange
          placeholder="Write a note..."
        />
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="btn-creative px-3 py-1.5 text-sm"
            // No validation: always enabled
          >
            {editingNote ? "Save Changes" : "Add Note"} {/* Updated button text */}
          </button>
          {editingNote && ( // Show cancel button only when editing
            <button
              type="button"
              className="btn-creative-secondary px-3 py-1.5 text-sm"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes List (below editor) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loadingNotes ? (
          // Skeleton loaders - grid layout
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="card-creative p-4 h-[180px] animate-pulse"
              >
                <div className="h-5 bg-card-bg/70 rounded w-3/4 mb-2"></div> {/* Title */}
                <div className="h-3 bg-card-bg/50 rounded w-1/2 mb-2"></div> {/* Date */}
                <div className="h-3 bg-card-bg/50 rounded w-full"></div> {/* Content */}
              </div>
            ))}
          </>
        ) : notes.length === 0 ? (
          <div className="text-text-secondary text-sm italic">No notes added yet.</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`card-creative relative group h-[180px] ${deletingNoteId === note.id ? 'animate-fade-out' : 'animate-fade-in'}`}
            >
              <button
                className={`w-full h-full text-left p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-orange overflow-hidden ${
                  editingNote?.id === note.id ? "ring-2 ring-accent-orange" : "" // Highlight based on editingNote.id
                }`}
                onClick={() => handleNoteClick(note)}
                type="button"
                tabIndex={0}
              >
                <div className="font-semibold text-text-primary text-lg mb-1 truncate">
                  {typeof note.title === "string" ? note.title : ""}
                </div>
                {note.lastUpdated && (
                  <div className="text-text-secondary text-xs mb-2">
                    Updated: {note.lastUpdated.toDate ? note.lastUpdated.toDate().toLocaleString() : "Unknown"}
                  </div>
                )}
                <div
                  className="text-text-secondary text-sm line-clamp-3"
                >
                  {typeof note.content === "string"
                    ? note.content.replace(/<[^>]+>/g, "").trim().slice(0, 100)
                    : ""}
                </div>
              </button>
              {/* Delete button, visible on hover or always for accessibility */}
              <button
                type="button"
                className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 bg-accent-orange text-primary-bg rounded px-2 py-1 text-xs font-semibold shadow-card hover:bg-accent-orange-hover focus:outline-none focus:ring-2 focus:ring-accent-orange transition-all duration-200"
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
                    if (typeof onDeleteNote === "function") {
                      // Set the deleting note ID to trigger animation
                      setDeletingNoteId(note.id);

                      // Clear any existing delete timeout
                      if (deleteTimeoutRef.current) {
                        clearTimeout(deleteTimeoutRef.current);
                      }

                      // Delay actual deletion until animation completes
                      deleteTimeoutRef.current = setTimeout(async () => {
                        await onDeleteNote(note.id);
                        setDeletingNoteId(null); // Reset after deletion
                      }, 400); // Match animation duration
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
