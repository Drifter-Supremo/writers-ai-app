import React, { useState, useCallback, useEffect, useRef } from "react"; // Added useCallback, useEffect, useRef
import RichTextEditor from "./RichTextEditor";
// Consider using lodash/debounce if available, otherwise simple implementation below
// import { debounce } from 'lodash';

export default function ProjectNotes({
  notes = [],
  loadingNotes = false,
  onAddNote,
  onEditNote, // optional, for editing support
  onDeleteNote, // required for delete button to work
}) {
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null); // Track which note is being deleted
  const debounceTimeoutRef = useRef(null); // Ref to hold timeout ID
  const deleteTimeoutRef = useRef(null); // Ref to hold delete animation timeout ID

  // Refs to always have latest values for debounce
  const noteTitleRef = useRef(noteTitle);
  const noteContentRef = useRef(noteContent);

  useEffect(() => {
    noteTitleRef.current = noteTitle;
  }, [noteTitle]);
  useEffect(() => {
    noteContentRef.current = noteContent;
  }, [noteContent]);

  // Function to actually perform the save
  const performSave = useCallback((noteId, title, content) => {
    if (onEditNote && noteId) {
      console.log("Performing debounced save for note:", noteId); // Debug log
      // Ensure content is always passed, even if empty string
      onEditNote(noteId, { title: title ?? "", content: content ?? "" });
    }
  }, [onEditNote]);

  // Debounced save function - using simple setTimeout/clearTimeout
  // Always use latest title/content from refs to avoid stale closure
  const debouncedSaveContent = useCallback((noteId) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      performSave(noteId, noteTitleRef.current, noteContentRef.current);
    }, 1500); // 1.5 second debounce timer
  }, [performSave]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

   // Cleanup timeout when selected note changes to prevent saving to wrong note
   useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, [selectedNoteId]);


  // Handle clicking a note to edit
  function handleNoteClick(note) {
    // Clear any pending save from previous note before loading new one
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSelectedNoteId(note.id);
    setNoteTitle(note.title || "");
    setNoteContent(note.content || "");
  }

   // Handle content change from RichTextEditor
   const handleContentChange = useCallback((newContent) => {
    setNoteContent(newContent);
    noteContentRef.current = newContent;
    // Only trigger debounced save if editing an existing note
    if (selectedNoteId) {
      debouncedSaveContent(selectedNoteId);
    }
  }, [selectedNoteId, debouncedSaveContent]);


  // Handle cancel edit
  function handleCancelEdit() {
     // Clear any pending save
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSelectedNoteId(null);
    setNoteTitle("");
    setNoteContent("");
  }

  // Handle save (add or explicit edit save)
  function handleSaveNote(e) {
    e.preventDefault();
    // Clear any pending debounced save since we're saving explicitly
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    const noteData = {
      title: noteTitle ?? "",
      content: noteContent ?? "",
    };

    if (selectedNoteId) {
      // Explicitly save both title and content when editing via button
      if (onEditNote) {
        console.log("Performing explicit save for note:", selectedNoteId); // Debug log
        onEditNote(selectedNoteId, noteData);
      }
      // Reset form after explicit save
      setSelectedNoteId(null);
      setNoteTitle("");
      setNoteContent("");
    } else {
      // Add new note
      onAddNote(noteData);
      // Clear form after adding
      setNoteTitle("");
      setNoteContent("");
    }
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
          onChange={(e) => {
            setNoteTitle(e.target.value);
            noteTitleRef.current = e.target.value;
            // Only trigger debounced save if editing an existing note
            if (selectedNoteId) {
              debouncedSaveContent(selectedNoteId);
            }
          }}
        />
        <RichTextEditor
          content={noteContent}
          onChange={handleContentChange} // Use the new handler with debouncing
          placeholder="Write a note..."
        />
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="bg-orange-vibrant text-white px-4 py-2 rounded-md font-medium hover:brightness-110 transition duration-200 disabled:opacity-60"
            // No validation: always enabled
          >
            {selectedNoteId ? "Save Changes" : "Add Note"}
          </button>
          {selectedNoteId && (
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
                  selectedNoteId === note.id ? "ring-2 ring-orange-vibrant" : ""
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
