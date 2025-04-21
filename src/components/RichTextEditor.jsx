import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";

export default function RichTextEditor({ content = "", onChange, placeholder = "Write something..." }) {
  const editor = useEditor({
    extensions: [
      // Restore Underline, use default StarterKit
      StarterKit,
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        // Remove all prose classes, just keep base styles
        class: "ProseMirror p-3 min-h-[150px] focus:outline-none text-cream-yellow",
        spellCheck: "true",
        placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  // Update editor content if the prop changes (for controlled usage)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p></p>");
    }
    // eslint-disable-next-line
  }, [content]);

  return (
    <div className="bg-teal-light border border-cream-yellow/30 rounded-md">
      <EditorToolbar editor={editor} />
      {/* Remove prose classes from wrapper div */}
      <div className="max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}