# Writers AI Assistant - Task List

This document outlines the remaining tasks required to complete and polish the Writers AI Assistant application.

---

## Phase 1: Core Functionality & UX Foundations (Addressing TODOs & Polish)

### 1.1. Loading & Skeleton States
- [x] **Projects Dashboard:**
    - [x] Implement skeleton loader for project cards while fetching data.
- [x] Add loading indicator for project creation/deletion.
- [x] **Project Detail View:**
    - A visually consistent skeleton loader is now shown for the Project Overview section while project data is loading.
    - The Files section now displays skeleton loaders whenever files are being fetched, uploaded, or deleted, ensuring a smooth user experience during all asynchronous operations.
- [x] Implement skeleton loader for project title/description area.
- [x] Implement skeleton loader for the Files section.
- [x] Implement skeleton loader for the Notes section.
- [x] Add loading indicators for file upload/delete actions.
- [x] Add loading indicators for note add/delete actions.
- [x] Add loading indicator for saving project detail edits.
- [x] **Character Workflows:**
    - [x] Implement skeleton loader for workflow cards list (`Workflows.jsx`).
    - [x] Implement skeleton loader for project list in Link Workflow modal.
- [x] **Project Detail Sidebar Navigation:**
    - The sidebar navigation is static and does not require a loading state.
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
    - [x] Display user-friendly error messages (e.g., using custom `Notification.jsx` component) for failed operations.
- [x] **Project Detail:**
    - [x] Implement a "Project Not Found" state if the `projectId` in the URL is invalid or the document doesn't exist.
- [x] **File Management:**
    - [x] Add client-side validation for allowed file types before upload.
    - [x] Add client-side validation for file size limits.
    - [x] Handle potential duplicate file names gracefully (e.g., append timestamp or number).
    - [x] Handle Firebase Storage errors (quota exceeded, permissions).
- [x] **Settings Form:**
    - [x] Add input validation (e.g., required fields, format checks if applicable).
    - [x] Display validation errors clearly to the user.
    - [x] Disable "Save Preferences" button if the form is invalid.

### 1.3. Home Page Implementation
- [x] **Define Purpose:** Define the content and function of the Home page (e.g., welcome message, quick stats, recent projects, getting started guide). (Workflow UI moved to dedicated page).
- [x] **Implement Content:** Build the React component (`src/routes/Home.jsx`) with the chosen content.
    - [x] Add welcoming text and brief app description.
    - [x] Potentially display quick links or summary information (e.g., number of projects).
    - [x] Ensure styling aligns with the rest of the application.
    - [x] Remove Character Workflow dashboard UI (moved to `/workflows`).

### 1.4. Character Workflow Restructuring & Linking (Partially Superseded)
*Note: The core workflow execution UI described here was replaced by the Enhanced Workflow Engine (see 1.5), but the workflow listing, linking, and navigation aspects remain relevant.*
- [x] **Create Dedicated Workflows Page:**
    - [x] Create new route `/workflows`.
    - [x] Create `src/routes/Workflows.jsx` component.
    - [x] Move Character Workflow UI (start card, list) from `Home.jsx` to `Workflows.jsx`.
    - [x] Add "Workflows" link to sidebar navigation (`Layout.jsx`).
- [x] **Implement Project Linking/Unlinking:**
    - [x] Add "Link to Project" option to workflow card menu (`CharacterWorkflowList.jsx`).
    - [x] Create `LinkWorkflowModal.jsx` to fetch and display projects for selection.
    - [x] Implement Firestore update to add `linkedProjectId` to `characterWorkflows` document on link.
    - [x] Add "Unlink Project" option to menu (visible only when linked).
    - [x] Implement Firestore update to remove `linkedProjectId` using `deleteField()` on unlink.
    - [x] Create `LinkedProjectDisplay.jsx` to show linked project name on card.
    - [x] Replace `alert()` with `Notification.jsx` for feedback on link/unlink actions.
    - [x] Fix state declaration issues in `CharacterWorkflowList.jsx`.
    - [x] Fix modal project selection to use `project.name`.

### 1.5. Enhanced Character Workflow Implementation
- [x] **New Structure:** Created `/src/workflows/`, `/src/workflows/components/`, `/src/workflows/configs/`.
- [x] **Config-Driven:** Implemented `src/workflows/configs/characterWorkflowConfig.js` to define workflow structure.
- [x] **Core Engine:** Developed `WorkflowEngine.jsx` for logic, state management, Firestore load/save (debounced autosave).
- [x] **UI Components:** Created `WorkflowSection.jsx` and `QuestionCard.jsx` for rendering UI based on config.
- [x] **Features:**
    - [x] Added image display per question in `QuestionCard.jsx`.
    - [x] Included placeholder `AIHelperModal.jsx` and AI button in `QuestionCard.jsx`.
    - [x] Implemented debounced autosave for workflow answers.
- [x] **Routing:** Created top-level `CharacterWorkflow.jsx` route component and updated `App.jsx` route `/character-workflow/:id`.
- [x] **Data Storage:** Storing workflow answers in Firestore at `characterWorkflows/{workflowId}/answers/{questionId}`.


### 1.6. Theme Implementation & UI Fixes
- [x] **"Retro Space" Theme:** Implemented new dark theme (teal/orange/cream).
- [x] **Component Styling:** Updated styles across all major components to use the new theme.
- [x] **UI Fixes:**
    - [x] Replaced sidebar header text with logo image (links home).
    - [x] Removed emojis from sidebar navigation links.
    - [x] Fixed workflow card button resizing issue.
    - [x] Removed vertical right border from main sidebar.
    - [x] Removed horizontal bottom border from sidebar logo container.

---
**Phase 1 Summary:**  
All loading and skeleton state tasks for the Project Detail View and its sidebar navigation are now complete and fully polished.

## Phase 2: Authentication & User Management

### 2.1. Firebase Authentication Setup
- [ ] **Enable Auth Provider:** Enable Email/Password authentication in the Firebase console (consider adding Google/other providers later).
- [ ] **Install Firebase Auth SDK:** Ensure `@firebase/auth` is correctly configured in `src/services/firebase.js`.
- [ ] **Auth State Management:**
    - [ ] Implement a mechanism to track the current user's authentication state globally (e.g., using React Context or a state management library).
    - [ ] Use Firebase's `onAuthStateChanged` listener to update the auth state.

### 2.2. UI Components & Routing
- [x] **Create Auth Routes:** Added routes for `/login`, `/signup`.
- [x] **Create Login Component:** Built `src/routes/Login.jsx` with email/password fields, Google sign-in, and login button.
- [x] **Create Signup Component:** Built `src/routes/Signup.jsx` with email/password fields, Google sign-in, and signup button.
- [x] **Protected Routes:** Implemented `ProtectedRoute` to protect routes (like `/projects`, `/settings`, `/workflows`, `/character-workflow`) so they are only accessible to logged-in users, redirecting others to `/login`.
- [x] **Update Layout/Navbar:**
    - [x] Sidebar now conditionally displays Login/Signup links or User Info/Logout button based on auth state.

### 2.3. Authentication Logic
- [x] **Signup Functionality:** Implemented user registration using `createUserWithEmailAndPassword` and Google sign-in.
- [x] **Login Functionality:** Implemented user login using `signInWithEmailAndPassword` and Google sign-in.
- [x] **Logout Functionality:** Implemented user logout using `signOut`.
- [x] **Error Handling:** Added robust error handling for auth operations (e.g., invalid email, wrong password, user exists). Displays clear feedback to the user.
- [ ] **(Optional) Password Reset:** Implement password reset functionality.

### 2.4. Multi-User Data Structure & Access Control
- [x] **Firestore Data Structure:**
    - [x] Added a `userId` field to the `projects` collection documents.
    - [x] Added a `userId` field to the `userPreferences` documents (if storing settings per user).
    - [x] Ensured subcollections (notes, files) are implicitly tied to the user via the parent project document.
    - [x] Added a `userId` field to `characterWorkflows` and all relevant subcollections.
- [x] **Firestore Queries:**
    - [x] Updated `getDocs` calls (e.g., in `Projects.jsx`, `CharacterWorkflowList.jsx`) to query only documents where `userId` matches the logged-in user's UID (`where("userId", "==", currentUser.uid)`).
    - [x] Updated `getDoc` calls (e.g., in `ProjectDetail.jsx`) to verify the fetched document belongs to the current user.
- [x] **Firestore Writes:**
    - [x] Ensured `addDoc` for new projects, workflows, notes, files, and preferences includes the `userId` of the current user.
    - [x] Ensured `updateDoc`, `deleteDoc` operations are only allowed on documents belonging to the current user (primarily enforced by security rules, but client-side checks are good practice).
- [x] **Firebase Storage Structure:**
    - [ ] (Planned) Modify storage paths to include the `userId`, e.g., `users/{userId}/projects/{projectId}/files/{filename}`.
    - [ ] (Planned) Update file upload/delete logic in `ProjectDetail.jsx` to use these user-specific paths.
- [x] **Security Rules (CRITICAL):**
    - [x] **Firestore Rules:** Wrote and deployed rules (`firestore.rules`) to ensure:
        - Users must be authenticated to read/write any project-related data (`request.auth != null`).
        - Users can only read/write documents (projects, notes, files metadata, settings, workflows) where the `userId` field matches their own `request.auth.uid`.
        - Defined rules for subcollections accordingly.
    - [ ] **Storage Rules:** (Planned) Write and deploy rules (`storage.rules`) to ensure:
        - Users must be authenticated (`request.auth != null`).
        - Users can only read/write files within their own user-specific path (`request.auth.uid == userIdInPath`).

- [x] **Character Workflow Isolation:** Only the current user's workflows are visible and accessible after login.
- [x] **Post-Login Redirect:** After login or signup, users are now redirected to the home page (`/`) instead of `/projects`.

---
**Authentication system is now complete:**  
- Email/Password and Google sign-in supported
- Protected routes and sidebar auth UI implemented
- UserId-based data isolation and Firestore security rules implemented for projects, files, notes, preferences, and workflows.

## Phase 3: Feature Enhancements

### 3.0. Landing Page Layout Refinement
- [ ] **Fix Image Display:** Ensure the entire landing page image is visible without cropping top or bottom, using `background-size: contain` and `background-position: center`. Fill extra space with `bg-teal-deep`.
- [ ] **Fix Sign-in Box Position:** Absolutely position the sign-in box clearly below the Medusa logo on the right, ensuring no overlap on any screen size. Adjust `top` offset and responsive styles as needed.
- [ ] **Fix Google Button Style:** Ensure Google button uses `bg-teal-light` (or `bg-teal-deep`) background while keeping the logo and blue text.

- [x] **Landing page full-viewport background & centered sign‑in:** Added `.landing-background` CSS class for responsive full-viewport backgrounds (default vs. high‑dpi PNG via media query); refactored `LandingPage.jsx` to use Flexbox centering and margin‑top utilities instead of absolute positioning; adjusted `background-position` and switched to `background-size: contain` to prevent the logo/tagline from cropping.

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

### 3.4. Homepage Revamp Tasks
- [ ] **Implement Welcome & Quickstart Section:**
    - [ ] Add a welcome message and quick action buttons: Start New Workflow, Resume Saved Workflow, Go to Projects.
- [ ] **Add User Progress Stats:**
    - [ ] Display visual stat cards or icon pills showing creative activity metrics:
        - Projects Created
        - Characters Defined
        - Notes Written
        - Workflows Completed
        - Files Uploaded
- [ ] **Create Recent Activity Feed:**
    - [ ] Show chronological logs of recent user events and actions.
- [ ] **Add Featured Workflow Section:**
    - [ ] Implement a rotating highlight section showcasing featured workflows.
- [ ] **Plan AI Suggestions Panel:**
    - [ ] Design a future panel offering bite-sized writing prompts or ideas powered by AI.
- [ ] **Incorporate Workflow Strategy & Design Principles:**
    - [ ] Implement structured form-based workflows.
    - [ ] Add scoped AI brainstorm buttons for targeted creative assistance.

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

### 4.3. AI-Powered Features (Workflow & Notes)
- [ ] **Character Workflow AI Helper:**
    - [ ] Implement actual AI API calls within `AIHelperModal.jsx`.
    - [ ] Pass relevant question context (from `QuestionCard.jsx` via `WorkflowEngine.jsx`) to the AI.
    - [ ] Provide UI for user to accept/modify AI suggestions and populate the `QuestionCard` input.
- [ ] **Notes Contextual Suggestions:** Plan and implement specific AI features for the notes editor (e.g., "Suggest plot points," "Analyze character consistency," "Rewrite this paragraph").
- [ ] **Trigger Points:** Determine how users will invoke these features (e.g., buttons within the notes editor, context menus, AI button in `QuestionCard`).
- [ ] **UI Integration:** Integrate these features into the relevant UI sections (`ProjectDetail` notes editor, `QuestionCard`).

---

## Phase 5: Testing & Quality Assurance

### 5.1. Unit Testing
- [ ] **Setup:** Configure a testing framework (e.g., Vitest, React Testing Library).
- [ ] **Component Tests:** Write unit tests for key components (e.g., `ProjectCard`, `FileUploader`, `NotesList`, `SettingsForm`, `Chatbox`, `WorkflowEngine`, `QuestionCard`).
    - [ ] Test rendering based on props/config.
    - [ ] Test event handlers, state changes, and autosave logic (`WorkflowEngine`, `QuestionCard`).
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
    - [ ] Completing a character workflow using the `WorkflowEngine`.
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
- [x] **Consistency Check:** Review the entire application for UI consistency (spacing, typography, colors, component styles). *(Partially addressed by "Retro Space" theme implementation)*.
- [ ] **Animation Polish:** Refine existing animations and add subtle transitions where appropriate (e.g., sidebar collapse if implemented, section transitions).
- [ ] **Accessibility (A11y):**
    - [ ] Perform accessibility audit (using tools like Axe DevTools).
    - [ ] Ensure proper ARIA attributes are used.
    - [ ] Verify keyboard navigation is seamless.
    - [ ] Check color contrast ratios (using new "Retro Space" theme palette).
- [ ] **Empty States:** Ensure all areas with dynamic content have well-designed empty states (e.g., no projects, no files, no notes).
- [ ] **Feedback States:** Enhance visual feedback for user actions (e.g., clearer success messages, more distinct loading indicators).
- [ ] **Workflow UI Enhancements:**
   - [ ] Add fading animations/transitions between workflow questions in `WorkflowEngine`.
   - [ ] Consider adding a progress indicator (e.g., step count, progress bar) to `WorkflowEngine`.
   - [ ] Improve styling/layout of the "Build A New Character!" card on `/workflows` page.
   - [x] Standardize appearance (info displayed, button styles/placement) of Project cards (`ProjectCard.jsx`) and Workflow cards (`CharacterWorkflowList.jsx`). *(Addressed by theme update)*.

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

## Updates
2025-04-15: Marked Character Workflow Restructuring/Linking tasks (1.4) as complete/superseded. Added new section (1.5) detailing the completion of the Enhanced Character Workflow implementation. Updated AI Integration (4.3), Testing (5.1, 5.3), and Polish (6.1) tasks to reflect the new workflow components and structure.
2025-04-15: Added new section (1.6) marking the "Retro Space" theme implementation and associated UI fixes as complete. Updated related polish tasks (6.1) to reflect this completion.
