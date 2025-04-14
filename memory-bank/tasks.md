# Writers AI Assistant - Task List

This document outlines the remaining tasks required to complete and polish the Writers AI Assistant application.

---

## Phase 1: Core Functionality & UX Foundations (Addressing TODOs & Polish)

### 1.1. Loading & Skeleton States
- [x] **Projects Dashboard:**
    - [x] Implement skeleton loader for project cards while fetching data.
- [x] Add loading indicator for project creation/deletion.
- [ ] **Project Detail View:**
- [x] Implement skeleton loader for project title/description area.
- [x] Implement skeleton loader for the Files section.
- [x] Implement skeleton loader for the Notes section.
- [x] Add loading indicators for file upload/delete actions.
- [x] Add loading indicators for note add/delete actions.
- [x] Add loading indicator for saving project detail edits.
- [ ] **Project Detail Sidebar Navigation:**
- [x] Implement sidebar section switching (Overview, Files, Notes, Settings).
  - Modular sections for Overview, Files, Notes, Settings
  - Files section: left-aligned upload form, file grid, upload/delete with skeleton loaders and confirmation
  - Overview: edit functionality restored
- [x] **Settings Page:**
- [x] Add loading indicator while fetching/saving preferences.
- [x] Add loading indicator for clearing preferences.

### 1.2. Error Handling & Validation (Addressing TODOs)
- [x] **Firebase Operations:**
    - [x] Wrap all Firestore `getDocs`, `getDoc`, `addDoc`, `updateDoc`, `deleteDoc` calls in `try/catch` blocks.
    - [x] Wrap all Firebase Storage `uploadBytes`, `getDownloadURL`, `deleteObject` calls in `try/catch` blocks.
    - [x] Display user-friendly error messages (e.g., using toasts or inline messages) for failed operations.
- [ ] **Project Detail:**
    - [ ] Implement a "Project Not Found" state if the `projectId` in the URL is invalid or the document doesn't exist.
- [ ] **File Management:**
    - [ ] Add client-side validation for allowed file types before upload.
    - [ ] Add client-side validation for file size limits.
    - [ ] Handle potential duplicate file names gracefully (e.g., append timestamp or number).
    - [ ] Handle Firebase Storage errors (quota exceeded, permissions).
- [ ] **Settings Form:**
    - [ ] Add input validation (e.g., required fields, format checks if applicable).
    - [ ] Display validation errors clearly to the user.
    - [ ] Disable "Save Preferences" button if the form is invalid.

### 1.3. Home Page Implementation
- [ ] **Define Purpose:** Decide on the content and function of the Home page (e.g., welcome message, quick stats, recent projects, getting started guide).
- [ ] **Implement Content:** Build the React component (`src/routes/Home.jsx`) with the chosen content.
    - [ ] Add welcoming text and brief app description.
    - [ ] Potentially display quick links or summary information (e.g., number of projects).
    - [ ] Ensure styling aligns with the rest of the application.

---

## Phase 2: Authentication & User Management

### 2.1. Firebase Authentication Setup
- [ ] **Enable Auth Provider:** Enable Email/Password authentication in the Firebase console (consider adding Google/other providers later).
- [ ] **Install Firebase Auth SDK:** Ensure `@firebase/auth` is correctly configured in `src/services/firebase.js`.
- [ ] **Auth State Management:**
    - [ ] Implement a mechanism to track the current user's authentication state globally (e.g., using React Context or a state management library).
    - [ ] Use Firebase's `onAuthStateChanged` listener to update the auth state.

### 2.2. UI Components & Routing
- [ ] **Create Auth Routes:** Add routes for `/login`, `/signup`.
- [ ] **Create Login Component:** Build `src/routes/Login.jsx` with email/password fields and login button.
- [ ] **Create Signup Component:** Build `src/routes/Signup.jsx` with email/password fields and signup button.
- [ ] **Protected Routes:** Implement a mechanism (e.g., a wrapper component) to protect routes (like `/projects`, `/settings`) so they are only accessible to logged-in users, redirecting others to `/login`.
- [ ] **Update Layout/Navbar:**
    - [ ] Conditionally display Login/Signup links or User Info/Logout button based on auth state.

### 2.3. Authentication Logic
- [ ] **Signup Functionality:** Implement user registration using `createUserWithEmailAndPassword`.
- [ ] **Login Functionality:** Implement user login using `signInWithEmailAndPassword`.
- [ ] **Logout Functionality:** Implement user logout using `signOut`.
- [ ] **Error Handling:** Add robust error handling for auth operations (e.g., invalid email, wrong password, user exists). Display clear feedback to the user.
- [ ] **(Optional) Password Reset:** Implement password reset functionality.

### 2.4. Multi-User Data Structure & Access Control
- [ ] **Firestore Data Structure:**
    - [ ] Add a `userId` field to the `projects` collection documents.
    - [ ] Add a `userId` field to the `userPreferences` documents (if storing settings per user).
    - [ ] Ensure subcollections (notes, files) are implicitly tied to the user via the parent project document.
- [ ] **Firestore Queries:**
    - [ ] Update `getDocs` calls (e.g., in `Projects.jsx`) to query only projects where `userId` matches the logged-in user's UID (`where("userId", "==", currentUser.uid)`).
    - [ ] Update `getDoc` calls (e.g., in `ProjectDetail.jsx`) to verify the fetched project belongs to the current user.
- [ ] **Firestore Writes:**
    - [ ] Ensure `addDoc` for new projects includes the `userId` of the current user.
    - [ ] Ensure `updateDoc`, `deleteDoc` operations are only allowed on documents belonging to the current user (primarily enforced by security rules, but client-side checks are good practice).
- [ ] **Firebase Storage Structure:**
    - [ ] Modify storage paths to include the `userId`, e.g., `users/{userId}/projects/{projectId}/files/{filename}`.
    - [ ] Update file upload/delete logic in `ProjectDetail.jsx` to use these user-specific paths.
- [ ] **Security Rules (CRITICAL):**
    - [ ] **Firestore Rules:** Write and deploy rules (`firestore.rules`) to ensure:
        - Users must be authenticated to read/write any project-related data (`request.auth != null`).
        - Users can only read/write documents (projects, notes, files metadata, settings) where the `userId` field matches their own `request.auth.uid`.
        - Define rules for subcollections accordingly.
    - [ ] **Storage Rules:** Write and deploy rules (`storage.rules`) to ensure:
        - Users must be authenticated (`request.auth != null`).
        - Users can only read/write files within their own user-specific path (`request.auth.uid == userIdInPath`).

---

## Phase 3: Feature Enhancements

### 3.1. Rich Text Editor for Notes
- [ ] **Choose Editor:** Select and install a rich text editor library (e.g., Tiptap or Quill).
- [ ] **Integrate Editor:** Replace the basic textarea in the Notes section (`ProjectDetail.jsx`) with the chosen editor component.
- [ ] **Implement Toolbar:** Add a simple toolbar with basic formatting options (e.g., Bold, Italic, Underline, Lists).
- [ ] **Data Handling:**
    - [ ] Ensure editor content (HTML or JSON) is correctly saved to Firestore when adding/editing notes.
    - [ ] Ensure existing notes are correctly loaded and displayed in the editor.
    - [ ] Handle potential data format changes if migrating from plain text.

### 3.2. Dynamic Document Viewer
- [ ] **Choose Viewer Library:** Research and select a suitable library for rendering common document types (PDF, DOCX, TXT) in the browser (e.g., `react-pdf`, `mammoth.js` for DOCX).
- [ ] **Integrate Viewer:**
    - [ ] Create a new component (e.g., `DocumentViewer.jsx`).
    - [ ] Add logic to fetch the file content/URL from Firebase Storage based on the selected file.
    - [ ] Implement conditional rendering based on file type (PDF viewer, DOCX-to-HTML converter, plain text display).
- [ ] **UI Integration:**
    - [ ] Modify the Files section in `ProjectDetail.jsx`.
    - [ ] Add a "View" button or make file names clickable.
    - [ ] Display the `DocumentViewer` component, potentially in a modal or a dedicated panel within the Project Detail view.
    - [ ] Add loading state while fetching/rendering the document.
    - [ ] Add error handling if a document fails to load or render.

### 3.3. Drag-and-Drop Functionality
- [ ] **File Upload:**
    - [ ] Implement a drag-and-drop zone for file uploads in the Files section.
    - [ ] Provide visual feedback during drag-over and on drop.
    - [ ] Integrate with the existing file upload logic.
- [ ] **(Optional) Note Reordering:**
    - [ ] Implement drag-and-drop reordering for notes within the Notes section.
    - [ ] Update Firestore data (potentially add an `order` field) to persist the new order.
- [ ] **(Optional) Project Card Reordering:**
    - [ ] Implement drag-and-drop reordering for project cards on the dashboard.
    - [ ] Update Firestore data to persist the order.

---

## Phase 4: AI Integration

### 4.1. Backend Setup (if needed)
- [ ] **Secure API Key:** Evaluate if the Gemini API key needs to be moved to a secure backend function (e.g., Firebase Cloud Functions) instead of being exposed client-side (HIGHLY RECOMMENDED).
    - [ ] Create Firebase Cloud Function endpoint to handle Gemini API calls.
    - [ ] Update client-side code to call the Cloud Function endpoint.
- [ ] **Context Management Strategy:**
    - [ ] Finalize the strategy for building and passing project context (notes, file summaries, character details) to the AI.
    - [ ] Implement logic to retrieve relevant context from Firestore based on the current project.
    - [ ] Consider token limits and context summarization techniques.

### 4.2. AI Chatbox Implementation
- [ ] **Create Chat Component:** Build a dedicated `Chatbox.jsx` component.
- [ ] **UI Elements:**
    - [ ] Message display area (showing user and AI messages).
    - [ ] Text input field for user prompts.
    - [ ] Send button.
    - [ ] Loading indicator while AI is responding.
- [ ] **API Integration:**
    - [ ] Implement function to call the Gemini API (or the Cloud Function wrapper) with the user prompt and project context.
    - [ ] Handle API responses and display AI messages in the chat UI.
    - [ ] Implement error handling for API calls.
- [ ] **Integrate into Project Detail:** Add the `Chatbox.jsx` component to the `ProjectDetail.jsx` view (likely within its own tab or section).
- [ ] **Conversation History:**
    - [ ] Decide if chat history needs to be persisted in Firestore.
    - [ ] If yes, implement logic to save and load chat messages for each project.

### 4.3. AI-Powered Features (Beyond Chat)
- [ ] **Contextual Suggestions:** Plan and implement specific AI features (e.g., "Suggest plot points," "Analyze character consistency," "Rewrite this paragraph").
- [ ] **Trigger Points:** Determine how users will invoke these features (e.g., buttons within the notes editor, context menus).
- [ ] **UI Integration:** Integrate these features into the relevant UI sections.

---

## Phase 5: Testing & Quality Assurance

### 5.1. Unit Testing
- [ ] **Setup:** Configure a testing framework (e.g., Vitest, React Testing Library).
- [ ] **Component Tests:** Write unit tests for key components (e.g., `ProjectCard`, `FileUploader`, `NotesList`, `SettingsForm`, `Chatbox`).
    - [ ] Test rendering based on props.
    - [ ] Test event handlers and state changes.
    - [ ] Mock Firebase/API calls where necessary.
- [ ] **Utility/Hook Tests:** Write tests for any utility functions or custom hooks.

### 5.2. Integration Testing
- [ ] **Firebase Interaction:** Test the integration between components and Firebase services.
    - [ ] Test data fetching logic (e.g., ensuring `Projects.jsx` correctly fetches and displays projects).
    - [ ] Test data writing logic (e.g., creating a project, adding a note, uploading a file).
    - [ ] Test data deletion logic.
- [ ] **Routing:** Test navigation between different routes and dynamic route handling (`ProjectDetail`).

### 5.3. End-to-End (E2E) Testing
- [ ] **Setup:** Configure an E2E testing framework (e.g., Cypress, Playwright).
- [ ] **Key User Flows:** Write E2E tests for critical user journeys:
    - [ ] Creating a new project.
    - [ ] Navigating to a project, adding a note, uploading a file, deleting them.
    - [ ] Interacting with the AI chatbox.
    - [ ] Updating user settings.
    - [ ] Searching/filtering projects (if implemented).

### 5.4. Manual Testing & QA
- [ ] **Cross-Browser Testing:** Test the application on major browsers (Chrome, Firefox, Safari, Edge).
- [ ] **Responsive Testing:** Test thoroughly on different screen sizes (desktop, tablet, mobile).
- [ ] **Usability Testing:** Perform manual walkthroughs focusing on ease of use and identifying UX friction points.
- [ ] **Content Testing:** Verify all static text, labels, and messages are clear and correct.

---

## Phase 6: Final Polish & Deployment Prep

### 6.1. UI/UX Refinements
- [ ] **Consistency Check:** Review the entire application for UI consistency (spacing, typography, colors, component styles).
- [ ] **Animation Polish:** Refine existing animations and add subtle transitions where appropriate (e.g., sidebar collapse if implemented, section transitions).
- [ ] **Accessibility (A11y):**
    - [ ] Perform accessibility audit (using tools like Axe DevTools).
    - [ ] Ensure proper ARIA attributes are used.
    - [ ] Verify keyboard navigation is seamless.
    - [ ] Check color contrast ratios.
- [ ] **Empty States:** Ensure all areas with dynamic content have well-designed empty states (e.g., no projects, no files, no notes).
- [ ] **Feedback States:** Enhance visual feedback for user actions (e.g., clearer success messages, more distinct loading indicators).

### 6.2. Performance Optimization
- [ ] **Bundle Analysis:** Analyze the production build bundle size and identify potential areas for optimization.
- [ ] **Code Splitting:** Ensure route-based code splitting is working effectively. Consider component-level splitting if needed.
- [ ] **Image Optimization:** Optimize any static image assets.
- [ ] **Firebase Query Optimization:** Review Firestore queries for efficiency. Ensure necessary indexes are created (`firestore.indexes.json`).
- [ ] **Lazy Loading:** Implement lazy loading for components or libraries where appropriate.

### 6.3. Documentation Updates
- [ ] **Memory Bank:** Update all `memory-bank/` files to reflect the final state of the application.
- [ ] **README.md:** Update the main `README.md` with final setup instructions, feature overview, and deployment notes.
- [ ] **Code Comments:** Review and add necessary code comments, especially for complex logic.
- [ ] **.clinerules:** Populate the `.clinerules` file with learned patterns and project intelligence.

### 6.4. Deployment (Target: Railway)
- [ ] **Railway Project Setup:** Configure project on Railway, connecting to the GitHub repository.
- [ ] **Build Configuration:** Ensure Railway uses the correct build command (`npm run build`) and publish directory (`dist`).
- [ ] **Build Process:** Verify the `npm run build` command generates the production-ready assets correctly in the `dist` folder.
- [ ] **Firebase Security Rules:** Finalize and deploy Firestore and Storage security rules (as Firebase services are still used).
- [ ] **Environment Variables:** Manage API keys and environment-specific configurations securely within Railway's environment variable settings.
- [ ] **Custom Domain (Optional):** Configure a custom domain on Railway if needed.
- [ ] **CI/CD Pipeline (Optional):** Set up a CI/CD pipeline (e.g., using GitHub Actions) for automated testing and deployment triggers if Railway's default GitHub integration isn't sufficient.

---
