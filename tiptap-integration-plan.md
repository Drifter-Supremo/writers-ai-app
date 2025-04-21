# Tiptap Rich Text Editor Integration Plan

This document outlines the detailed implementation plan for integrating a Tiptap rich text editor into the "Notes" section of the Writers AI Assistant application, replacing the current simple textarea.

**Goal:** Implement task 3.1 from `memory-bank/tasks.md`.

**Key Requirements:**
*   Minimal Tiptap editor with basic toolbar (Bold, Italic, Underline, Bullet List, Numbered List).
*   Integration into `src/routes/ProjectDetail.jsx` -> `src/components/ProjectNotes.jsx`.
*   Strict adherence to "Retro Space" theme (Tailwind utility classes).
*   Correct saving/loading of rich text content (HTML) to/from Firestore (`projects/{projectId}/notes/{noteId}`).
*   Display existing notes (rendering HTML).

---

## 1. Dependencies

*   **Install Tiptap Packages:**
    ```bash
    npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
    ```
    *   `@tiptap/react`: React components and hooks.
    *   `@tiptap/pm`: ProseMirror core libraries.
    *   `@tiptap/starter-kit`: Essential extensions (Paragraph, Bold, Italic, Underline, Lists, etc.).

*   **Install Icon Library:**
    ```bash
    npm install react-icons
    ```

*   **(Optional) Install Tailwind Typography Plugin:**
    ```bash
    npm install -D @tailwindcss/typography
    ```
    *   If installed, add `require('@tailwindcss/typography')` to `plugins` in `tailwind.config.js`.

---

## 2. Component Structure

*   **`src/components/RichTextEditor.jsx` (New Component):**
    *   **Responsibility:** Encapsulates Tiptap editor instance, toolbar, and content area. Manages editor state.
    *   **Props:**
        *   `content` (String, optional): Initial HTML content.
        *   `onChange` (Function): Callback triggered on change, passing HTML content (`editor.getHTML()`).
        *   `placeholder` (String, optional): Editor placeholder text.
    *   **Implementation:**
        *   Use `useEditor` hook (`@tiptap/react`) with `StarterKit`.
        *   Pass `editor` instance to `EditorToolbar`.
        *   Render `<EditorContent editor={editor} />`.
        *   Use `editor.on('update', ...)` to call `onChange` prop.

*   **`src/components/EditorToolbar.jsx` (New Component):**
    *   **Responsibility:** Renders toolbar buttons and handles interactions.
    *   **Props:**
        *   `editor` (Object): Tiptap editor instance.
    *   **Implementation:**
        *   Render a `div` container.
        *   For each format (Bold, Italic, Underline, Bullet List, Numbered List):
            *   Render button with `react-icons` icon (e.g., `FaBold`).
            *   `onClick`: Call Tiptap command (e.g., `editor.chain().focus().toggleBold().run()`).
            *   Conditional styling based on `editor.isActive(...)`.

---

## 3. File Modifications

*   **`package.json`:** Updated by `npm install`.
*   **`src/routes/ProjectDetail.jsx`:**
    *   **Modify `onAddNote`:** Expect HTML content (string). Firestore saving logic (`addDoc`) saves HTML to `content` field.
    *   **Pass `notes` Array:** Pass fetched `notes` array (with HTML content) to `ProjectNotes`.
*   **`src/components/ProjectNotes.jsx`:**
    *   **Receive Props:** Accept `notes` (Array) and `loadingNotes` (Boolean).
    *   **Display Existing Notes:**
        *   Add section above "Add Note" form.
        *   Handle `loadingNotes` state (show skeletons).
        *   Handle empty `notes` state (show message).
        *   Map over `notes`:
            *   Render container (`bg-teal-light`, padding, border, etc.).
            *   Render `note.content` using `dangerouslySetInnerHTML={{ __html: note.content }}`. Apply base text/prose styling.
            *   (Optional) Add metadata (e.g., date).
    *   **Replace Textarea:** Remove `<textarea>`.
    *   **Integrate `RichTextEditor`:**
        *   Render `<RichTextEditor />` inside the `form`.
        *   Manage editor content state locally (`useState`).
        *   Pass state to `RichTextEditor` `content` prop.
        *   Pass state setter to `RichTextEditor` `onChange` prop.
        *   Update `onSubmit` to use local state (`onAddNote(newNoteContent)`) and reset state.
        *   Update button disable logic based on editor content emptiness.
*   **`tailwind.config.js`:**
    *   (Optional) Add `require('@tailwindcss/typography')` to `plugins`.
*   **`src/index.css` (or similar):**
    *   Add base styling for `.ProseMirror` if not using typography plugin.

---

## 4. Styling (Tailwind CSS - "Retro Space" Theme)

*   **`RichTextEditor.jsx` Container:** `bg-teal-light border border-cream-yellow/30 rounded-md text-cream-yellow`.
*   **`EditorToolbar.jsx` Container:** `flex items-center space-x-1 p-2 border-b border-cream-yellow/30 bg-teal-light rounded-t-md`.
*   **Toolbar Buttons:**
    *   **Base:** `p-1.5 rounded text-cream-gray hover:bg-teal-deep hover:text-cream-yellow transition-colors duration-150`.
    *   **Active:** `bg-orange-vibrant/20 text-orange-vibrant` (when `editor.isActive(...)`).
    *   **Icons:** `text-lg`.
*   **Editor Content Area (`.ProseMirror`):**
    *   Apply `p-3 min-h-[150px] focus:outline-none`.
    *   **Text Color:** `text-cream-yellow`.
    *   **Prose Styling (Option 1: Typography Plugin):**
        *   Add `prose prose-invert ...` classes to container around `<EditorContent />`.
        *   Customize prose colors in `tailwind.config.js` to match theme (`cream-yellow`, `cream-gray`, `orange-vibrant`).
    *   **Prose Styling (Option 2: Manual Global CSS):**
        *   Add styles targeting `.ProseMirror`, `.ProseMirror p`, `.ProseMirror strong`, etc., in `src/index.css`. Use theme colors.
*   **Existing Note Display Container:** `bg-teal-light p-4 rounded-md border border-cream-yellow/20 mb-4`. Apply prose styling if needed.

---

## 5. Data Handling

*   **Storage Format:** **HTML** (string) via `editor.getHTML()`.
*   **Saving (Add Note):**
    *   `ProjectDetail.jsx`'s `onAddNote` receives HTML string.
    *   Save HTML string to `content` field in Firestore (`projects/{projectId}/notes`).
    *   Include `createdAt` and `userId`.
*   **Loading:**
    *   `fetchNotes` in `ProjectDetail.jsx` remains the same (fetches HTML in `content` field).
    *   Pass `notes` array to `ProjectNotes.jsx`.
*   **Displaying:**
    *   `ProjectNotes.jsx` maps `notes` array.
    *   Render `note.content` using `dangerouslySetInnerHTML`.
*   **Handling Existing Plain Text:**
    *   Plain text will render as-is via `dangerouslySetInnerHTML`.
    *   New notes start with an empty editor.
    *   (Editing existing notes, if implemented later, would automatically wrap plain text in `<p>` tags on load).

---

## 6. Integration Summary

1.  Replace `<textarea>` in `ProjectNotes.jsx` with `<RichTextEditor>`.
2.  Manage new note HTML content in `ProjectNotes.jsx` state via `RichTextEditor`'s `onChange`.
3.  Pass HTML content from state to `onAddNote` prop during form submission.
4.  `ProjectDetail.jsx` saves the HTML to Firestore via `onAddNote`.
5.  `ProjectDetail.jsx` fetches notes (with HTML) and passes them to `ProjectNotes.jsx`.
6.  `ProjectNotes.jsx` displays existing notes (rendering HTML) and provides the editor for new notes.