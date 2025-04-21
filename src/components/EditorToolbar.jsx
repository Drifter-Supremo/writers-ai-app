import React, { useState, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

export default function EditorToolbar({ editor }) {
  // Force re-render on transaction to ensure isActive states are updated
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const forceUpdate = () => setTick(tick => tick + 1);
    editor.on('transaction', forceUpdate);
    return () => {
      editor.off('transaction', forceUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  const buttonBase =
    "p-1.5 rounded text-cream-gray hover:bg-teal-deep hover:text-cream-yellow transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange-vibrant";
  const buttonActive = "bg-orange-vibrant text-white border-2 border-orange-vibrant shadow";

  return (
    <div className="flex items-center space-x-1 p-2 border-b border-cream-yellow/30 bg-teal-light rounded-t-md">
      {/* Undo Button */}
      <button
        type="button"
        className={`${buttonBase}`}
        onClick={() => editor.chain().focus().undo().run()}
        aria-label="Undo"
        tabIndex={0}
        disabled={!editor.can().undo()}
      >
        <FaUndo className="text-lg" />
      </button>
      {/* Formatting Buttons */}
      <button
        type="button"
        className={`${buttonBase} ${editor.isActive('bold') ? buttonActive : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        tabIndex={0}
      >
        <FaBold className="text-lg" />
      </button>
      <button
        type="button"
        className={`${buttonBase} ${editor.isActive('italic') ? buttonActive : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        tabIndex={0}
      >
        <FaItalic className="text-lg" />
      </button>
      <button
        type="button"
        className={`${buttonBase} ${editor.isActive('underline') ? buttonActive : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
        tabIndex={0}
      >
        <FaUnderline className="text-lg" />
      </button>
      <button
        type="button"
        className={`${buttonBase} ${editor.isActive('bulletList') ? buttonActive : ""}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet List"
        tabIndex={0}
      >
        <FaListUl className="text-lg" />
      </button>
      <button
        type="button"
        className={`${buttonBase} ${(editor.isActive('orderedList') || editor.isActive('ordered_list')) ? buttonActive : ""}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Numbered List"
        tabIndex={0}
      >
        <FaListOl className="text-lg" />
      </button>
      {/* Redo Button */}
      <button
        type="button"
        className={`${buttonBase}`}
        onClick={() => editor.chain().focus().redo().run()}
        aria-label="Redo"
        tabIndex={0}
        disabled={!editor.can().redo()}
      >
        <FaRedo className="text-lg" />
      </button>
    </div>
  );
}