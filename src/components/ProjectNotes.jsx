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
      <h2 className="text-2xl font-bold text-cream-yellow mb-6">Notes</h2>

      {/* Note Editor Form */}
      <form onSubmit={handleSaveNote} className="mb-6">
        <input
          type="text"
          className="w-full !bg-teal-light border border-cream-yellow/30 rounded-md p-3 text-cream-yellow min-h-[44px] mb-3 placeholder-cream-gray focus:ring-orange-vibrant focus:border-orange-vibrant shadow-sm"
          style={{ backgroundColor: '#1a4c5d' }}
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
            className="bg-orange-vibrant text-white px-4 py-2 rounded-md font-medium hover:brightness-110 transition duration-200 disabled:opacity-60"
            // No validation: always enabled
          >
            {editingNote ? "Save Changes" : "Add Note"} {/* Updated button text */}
          </button>
          {editingNote && ( // Show cancel button only when editing
            <button
              type="button"
              className="border border-cream-yellow text-cream-yellow px-4 py-2 rounded-md font-medium hover:bg-teal-deep transition duration-200"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes List (below editor) */}
      <div>
        {loadingNotes ? (
          // Skeleton loaders
          <div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-teal-light/50 rounded p-4 mb-4 animate-pulse h-16"
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-cream-gray text-sm italic">No notes added yet.</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`relative group mb-4 ${deletingNoteId === note.id ? 'animate-fade-out' : 'animate-fade-in'}`}
            >
              <button
                className={`w-full text-left bg-teal-light p-4 rounded-md border border-cream-yellow/20 hover:bg-teal-deep transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-vibrant ${
                  editingNote?.id === note.id ? "ring-2 ring-orange-vibrant" : "" // Highlight based on editingNote.id
                }`}
                onClick={() => handleNoteClick(note)}
                type="button"
                tabIndex={0}
              >
                <div className="font-semibold text-cream-yellow mb-1 truncate">
                  {typeof note.title === "string" ? note.title : ""}
                </div>
                <div
                  className="prose prose-invert prose-sm max-w-none prose-p:text-cream-yellow prose-strong:text-cream-yellow prose-em:text-cream-yellow prose-ul:text-cream-yellow prose-ol:text-cream-yellow prose-li:text-cream-yellow line-clamp-2"
                >
                  {typeof note.content === "string"
                    ? note.content.replace(/<[^>]+>/g, "").trim().slice(0, 120)
                    : ""}
                </div>
              </button>
              {/* Delete button, visible on hover or always for accessibility */}
              <button
                type="button"
                className="absolute top-2 right-2 opacity-80 group-hover:opacity-100 bg-orange-vibrant text-white rounded px-2 py-1 text-xs font-semibold shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-vibrant transition"
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
