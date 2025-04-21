import React, { useState, useEffect, useRef } from "react";
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
  const [menuOpenId, setMenuOpenId] = useState(null); // Track which note's menu is open
  const deleteTimeoutRef = useRef(null); // Ref to hold delete animation timeout ID
  const titleInputRef = useRef(null); // Ref for title input focus
  const addNoteButtonRef = useRef(null); // Ref for Add Note button focus
  const menuRefs = useRef({}); // Refs for menu click-outside detection

  // Cleanup delete timeout on unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Check all menu refs
      const openMenuRef = menuRefs.current[menuOpenId];
      if (openMenuRef && !openMenuRef.contains(event.target)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  // Handle clicking a note to edit
  function handleNoteClick(note) {
    setEditingNote(note); // Store the whole note object
    setNoteTitle(note.title || "");
    setNoteContent(note.content || "");
    // Focus the title input when editing starts
    setTimeout(() => titleInputRef.current?.focus(), 0);
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
    // Focus the Add Note button after cancelling
    setTimeout(() => addNoteButtonRef.current?.focus(), 0);
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
    // Focus the Add Note button after saving
    setTimeout(() => addNoteButtonRef.current?.focus(), 0);
  }

  // Determine if the button should be disabled
  const isTitleEmpty = noteTitle.trim().length === 0;
  // Check content: handle null/undefined and strip HTML before checking length
  const isContentEmpty = !noteContent || noteContent.replace(/<[^>]+>/g, "").trim().length === 0;
  const isButtonDisabled = isTitleEmpty || isContentEmpty;

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Notes</h2>

      {/* Note Editor Form */}
      <form onSubmit={handleSaveNote} className="mb-6">
        <label htmlFor="note-title-input" className="sr-only">Note Title</label>
        <input
          id="note-title-input"
          ref={titleInputRef} // Add ref
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
            ref={addNoteButtonRef} // Add ref
            type="submit"
            className="btn-creative px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
            disabled={isButtonDisabled} // Conditionally disable
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
                className="card-creative p-4 h-[120px] animate-pulse"
              >
                <div className="h-5 bg-card-bg/70 rounded w-3/4 mb-2"></div> {/* Title */}
                <div className="h-3 bg-card-bg/50 rounded w-1/2"></div> {/* Date */}
              </div>
            ))}
          </>
        ) : notes.length === 0 ? (
          <div className="text-text-secondary text-sm italic">No notes added yet.</div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`card-creative relative group h-[120px] ${deletingNoteId === note.id ? 'animate-fade-out' : 'animate-fade-in'}`}
            >
              <button
                className={`w-full h-full text-left p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-orange overflow-hidden ${
                  editingNote?.id === note.id ? "ring-2 ring-accent-orange" : "" // Highlight based on editingNote.id
                }`}
                onClick={() => handleNoteClick(note)}
                type="button"
                aria-label={`Edit note: ${typeof note.title === "string" && note.title ? note.title : 'Untitled Note'}`}
                tabIndex={0}
              >
                <div className="font-semibold text-text-primary text-lg truncate">
                  {typeof note.title === "string" ? note.title : ""}
                </div>
              </button>
              {/* 3-dot menu */}
              <div
                className="absolute top-2 right-2"
                ref={el => (menuRefs.current[note.id] = el)}
              >
                <button
                  type="button"
                  className="text-2xl font-bold dropdown-menu-button flex items-center justify-center"
                  aria-label="Note options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === note.id ? null : note.id);
                  }}
                >
                  ⋮
                </button>
                {menuOpenId === note.id && (
                  <div className="dropdown-menu absolute right-0 mt-1 w-48 z-10">
                    <button
                      type="button"
                      className="dropdown-menu-item-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Consider a more accessible confirmation modal instead of window.confirm
                        if (window.confirm(`Are you sure you want to delete the note "${typeof note.title === "string" && note.title ? note.title : 'Untitled Note'}"? This action cannot be undone.`)) {
                          if (typeof onDeleteNote === "function") {
                            // Set the deleting note ID to trigger animation
                            setDeletingNoteId(note.id);
                            setMenuOpenId(null); // Close the menu

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
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
