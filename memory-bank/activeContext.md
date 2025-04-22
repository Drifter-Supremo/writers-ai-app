# Active Context

## Current Development Focus

### Active Phase
Phase 2: Authentication & Landing Page

- Login/signup form refactored: single form, no duplicate/nested buttons.
- Top button row (Sign In/Sign Up) now acts as both mode switcher and submit.
- All lint/JSX errors resolved.
- Storage rules for Firebase are complete and deployed, ensuring user file isolation and security.
- UI is clean, intuitive, and matches the intended design.

### Recent Completions

1. **Notes Section Overhaul (2025-04-21)**
   - ✅ Implemented robust autosave for note content changes.
   - ✅ Fixed editor toolbar button active state highlighting.
   - ✅ Replaced direct delete button on note cards with a 3-dot menu containing the delete action.
   - ✅ Simplified note card appearance by removing content previews and metadata (timestamps).
   - ✅ Added auto-dismissing notifications for actions like save and delete.
   - ✅ Improved form validation: Add Note/Save Changes buttons are disabled until both title and content are provided.
   - ✅ Standardized button sizes across Notes and Files sections for UI consistency.

1. **Notes UI Improvements (`ProjectNotes.jsx`)**
   - ✅ Restyled note cards to match workflow card styling (`bg-teal-light`, `border`, `rounded-lg`).
   - ✅ Implemented responsive grid layout (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`).
   - ✅ Reduced size of Add/Cancel buttons in the note form (`px-3 py-1` instead of `px-4 py-2`).

1. **Landing Page Redesign & Fixes**
   - ✅ Replaced background image with solid color (`#032934`).
   - ✅ Added logo as foreground `<img>` element (`h-40`).
   - ✅ Added tagline "Draft. Organize. Evolve." (Migra Extralight font).
   - ✅ Resolved scrolling issues via `overflow: hidden` on `body` in `src/index.css`.
   - ✅ Restyled "Sign in with Google" button using inline styles (`backgroundColor: '#f9f4d9'`, `color: '#0f303d'`) due to Tailwind issues.
   - ✅ Ensured layout stability on resize.
   - ✅ *Supersedes previous "Landing Page Implementation (Initial)" and related layout fixes.*

2. **Reset Password Flow**
   - ✅ Added ResetPassword page with email link via Firebase Auth.
   - ✅ Fixed input overlap below logo tagline.

3. **Character Workflow User Isolation & Post-Login Redirect**
   - ✅ Character workflows are now fully user-isolated: only the current user's workflows are visible and accessible after login.
   - ✅ All workflow creation, queries, and security rules use userId for multi-user support.
   - ✅ After login or signup, users are now redirected to the home page (`/`) instead of `/projects`.
   - ✅ All changes tested and confirmed working for multiple accounts.

4. **Authentication System (Email/Password & Google, Protected Routes, Sidebar UI)**
   - ✅ Implemented Firebase Auth integration with Email/Password and Google sign-in.
   - ✅ Created AuthContext for global user state and auth actions.
   - ✅ Built Login and Signup pages with error handling, loading states, and Google sign-in.
   - ✅ Implemented ProtectedRoute to guard all private routes (`/projects`, `/settings`, `/workflows`, `/character-workflow`).
   - ✅ Updated sidebar navigation to show login/signup when logged out, and user info/logout when logged in.
   - ✅ Verified that authentication flow works for both providers and all protected navigation.
   - ⚠️ All users currently see all projects, settings, and workflows; next step is to implement userId-based data isolation and Firestore security rules.

5. **"Retro Space" Theme & UI Overhaul**
   - ✅ Implemented new "Retro Space" dark theme.
     - **Color Palette:** Deep teal/green (`#0f303d`), vibrant orange (`#f58a07`), cream/yellow (`#f9f4d9`).
     - **Backgrounds:** Solid deep teal/lighter teal for main, sidebar, cards, inputs. Removed gradients and white backgrounds.
     - **Text:** Cream/yellow for primary, lighter cream/gray for secondary. Removed purple text.
     - **Accents:** Vibrant orange for primary buttons/active states, cream/yellow for secondary buttons/borders.
   - ✅ Updated styles across all major components (Layout, Home, Projects, Workflows, Settings, ProjectDetail, Cards, Modals, etc.).
   - ✅ **UI Fixes:**
     - Replaced sidebar header text with logo image (larger, links home).
     - Removed emojis from sidebar navigation links.
     - Fixed workflow card button resizing issue.
     - Removed vertical right border from main sidebar.
     - Removed horizontal bottom border from sidebar logo container.

6. **(Superseded) UI/UX Phase 2 Overhaul**
   - *Previous color system (purple/blue/gradients) replaced by "Retro Space" theme.*
   - *Animation system remains.*
   - *Visual polish elements (blur, shadows) may be adjusted by new theme.*
   - *Interactive elements updated with new theme colors/styles.*

7. **Project Detail Skeleton Loader**
   - ✅ Implemented skeleton loader for Project Detail title/description area to improve perceived loading performance

8. **Project Card Actions Refactor**
   - ✅ Refactored project card actions: card click opens project, 3-dot menu contains delete with confirmation
   - ✅ Implemented skeleton loader for Project Detail Files section
   - ✅ Implemented skeleton loader for Project Detail Notes section
   - ✅ Implemented sidebar section switching in Project Detail view
   - ✅ Modularized Overview, Files, Notes, Settings sections
   - ✅ Files section: left-aligned upload form, file grid, upload/delete with skeleton loaders and confirmation, Firebase upload logic restored
   - ✅ Overview: edit functionality restored, break-words for long titles
   - ✅ Fixed heading cutoffs and improved Files section layout
   - ✅ Added loading indicators for file upload/delete actions in Project Detail
   - ✅ Added loading indicators for note add/delete actions in Project Detail
   - ✅ Added loading indicator for saving project detail edits

9. **Enhanced Character Workflow System (Major Refactor)**
   - ✅ **UI Restructuring:**
     - Created dedicated `/workflows` route and `Workflows.jsx` component.
     - Moved old workflow UI from `Home.jsx` to `Workflows.jsx`.
     - Added "Workflows" link to sidebar navigation.
     - Updated "Start Workflow" card styling (image, text).
   - ✅ **Config-Driven Engine:**
     - Implemented new directory structure (`/src/workflows/...`).
     - Created `characterWorkflowConfig.js` defining steps, questions, images, prompts.
     - Developed `WorkflowEngine.jsx` managing state, step logic, Firestore load/save.
     - Created `QuestionCard.jsx` displaying image, prompt, textarea (consistent size), AI placeholder button.
     - Implemented step-by-step navigation (Previous/Next/Finish buttons) within `WorkflowEngine.jsx` (positioned above card).
     - Implemented debounced autosave for answers in `WorkflowEngine` triggered by `QuestionCard`.
     - Created placeholder `AIHelperModal.jsx` triggered by AI button.
     - Created `CharacterWorkflow.jsx` route component using the engine.
     - Updated `/character-workflow` route in `App.jsx`.
   - ✅ **Project Linking:**
     - Implemented "Link/Unlink Project" options in `CharacterWorkflowList.jsx` menu.
     - Created `LinkWorkflowModal.jsx` for project selection (using `project.name`).
     - Created `LinkedProjectDisplay.jsx` to show linked project name on card.
     - Updated Firestore `characterWorkflows` documents with `linkedProjectId`.
   - ✅ **View Mode:**
     - Implemented read-only view mode (`?view=1` parameter).
     - `WorkflowEngine` renders AI profile placeholder and collapsible Q&A list.
     - `QuestionCard` displays answers as text, hides input/AI button.
   - ✅ **Fixes & Refinements:**
     - Fixed workflow resume logic to start at the first unanswered question.
     - Fixed new workflow logic to start at the introduction step.
     - Fixed autosave error (`updateDoc` import).
     - Fixed workflow naming (updates parent doc `name` field on save).
     - Fixed image loading paths and added missing images.
     - Replaced `alert()` with custom `Notification.jsx` for feedback.
     - Added skeleton loader for workflow loading state.
     - Adjusted padding/layout to improve vertical positioning.

10. **UI/UX Phase 1 Overhaul**
    - ✅ Replaced top navbar with sidebar navigation
      - Fixed-width sidebar (250px)
      - Logo image in header (links home), no text header.
      - Navigation links without emojis.
      - No vertical right border on sidebar.
      - Hover and active states (using new theme colors).
      - Prepared for future collapsibility.
    - ✅ Implemented split-view layout
      - Left panel navigation
      - Right panel content area
      - Responsive design
    - ✅ Enhanced content organization
      - Consistent card styling
      - Improved visual hierarchy
      - Better spacing patterns
    - ✅ Maintained all functionality
      - Project editing
      - File management
      - Notes system

11. **Settings Enhancements**
    - ✅ Added preferences summary display
      - Shows current Firestore values
      - Handles empty states gracefully
      - Updates automatically
    - ✅ Added Reset Form functionality
      - Resets to default values
      - Maintains Firestore data
      - Success feedback
    - ✅ Added Clear Preferences functionality
      - Deletes Firestore document
      - Resets local state
      - Error handling
    - ✅ Enhanced UI consistency
      - Maintained Tailwind patterns
      - Consistent button styling
      - Proper spacing and layout

12. **Settings Implementation**
    - ✅ User preferences panel with form fields
    - ✅ Firestore integration with proper path structure
    - ✅ Form validation and error handling
    - ✅ Loading states and success feedback
    - ✅ Consistent styling with app theme

13. **Notes Implementation**
    - ✅ Notes creation and storage in Firestore
    - ✅ Notes display with timestamps
    - ✅ Notes deletion with cleanup
    - ✅ Loading states and validation
    - ✅ Error handling

14. **File Management Implementation**
    - ✅ File upload form with type restrictions
    - ✅ Firebase Storage integration
    - ✅ File metadata in Firestore
    - ✅ File deletion functionality
    - ✅ File list display with download links

15. **Project Detail Implementation**
    - ✅ Dynamic routing to project details
    - ✅ Firestore document fetching
    - ✅ Basic detail view layout
    - ✅ Navigation from project cards
    - ✅ Project metadata editing
      - Name and description editing
      - Tag management with visual pills
      - Input validation and error handling
      - Save/cancel with feedback

16. **Firebase Integration**
    - ✅ Firebase package installed
    - ✅ firebase.js service file created
    - ✅ Basic Firestore integration
    - ✅ Project data fetching implemented

17. **Project Setup**
    - ✅ Vite + React initialization
    - ✅ Tailwind CSS configuration
    - ✅ Basic folder structure established

18. **Component Structure**
    - ✅ Created modular component skeleton
    - ✅ Set up routes directory
    - ✅ Set up components directory
    - ✅ Basic component placeholders

19. **Routing Implementation**
    - ✅ React Router integration
    - ✅ Basic route configuration
    - ✅ Navigation structure
    - ✅ Dynamic project routing

20. **Dashboard UI**
    - ✅ Projects page layout
    - ✅ ProjectCard component design
    - ✅ Responsive grid system
    - ✅ Basic UI elements
    - ✅ Project search implementation
      - Case-insensitive search on name/description
      - Debounced input for performance
      - Clear search button
      - "No results" feedback

21. **Navigation**
    - ✅ Navbar component implementation
    - ✅ React Router Link integration
    - ✅ Responsive layout
    - ✅ Consistent styling patterns

### In Progress
1. **Project Detail Enhancement**
   - Adding error states for missing documents
   - Implementing loading states
   - Polishing detail view layout
   - Adding navigation back to dashboard

2. **Dashboard Enhancement**
   - Adding user interactions
   - Enhancing navigation feedback
   - Adding loading states
   - Implementing error handling

3. **Firebase Enhancement**
   - Configuring security rules
   - Adding real-time updates
   - Implementing data validation

## Technical Decisions

### 1. Component Architecture
- Using functional components with hooks
- Implementing lazy loading for routes
- Keeping components modular and reusable
- Following route-based code organization
- Introduced new route components: `Workflows.jsx`
- Introduced new UI components: `LinkWorkflowModal.jsx`, `Notification.jsx`, `LinkedProjectDisplay.jsx`
- Added dedicated workflow directory structure: `/src/workflows/`, `/src/workflows/components/`, `/src/workflows/configs/`.
- Added new workflow components: `CharacterWorkflow.jsx` (route), `WorkflowEngine.jsx` (core logic), `QuestionCard.jsx` (UI), `AIHelperModal.jsx` (placeholder). (`WorkflowSection.jsx` was removed during refactor).
- Added UI components: `LinkWorkflowModal.jsx`, `Notification.jsx`, `LinkedProjectDisplay.jsx`.

### 2. Navigation Strategy
- Sidebar navigation (replacing previous top navbar)
- React Router Link components (without emojis)
- Consistent hover/active states using "Retro Space" theme colors
- Clear visual hierarchy
- Semantic HTML structure

### 3. UI Design Patterns
- Card-based project display
- Responsive grid layouts
- Consistent button styling
- Clear visual hierarchy
- Semantic HTML structure
- Navigation patterns:
  - Fixed-left sidebar navigation
  - Flex-based layout (Sidebar + Content Area)
  - Hover interactions (using new theme colors)
  - Active state indicators (using new theme colors, e.g., orange accent)
  - Modal dialogs for actions (`LinkWorkflowModal.jsx`)
  - Custom notification component (`Notification.jsx`) for user feedback instead of native alerts.
  - Skeleton loaders for asynchronous content areas.
  - Config-driven workflow layout:
    - `WorkflowEngine` manages overall state, step logic, and data flow.
    - `QuestionCard` displays individual questions step-by-step with associated images and input fields.
  - Step-by-step workflow navigation pattern.
  - Collapsible `<details>` element for View Mode Q&A list.

### 4. Styling Approach
- Using Tailwind utility classes with custom theme extensions.
- **"Retro Space" Theme:**
  - **Primary Colors:** Deep Teal/Green (`#0f303d`), Vibrant Orange (`#f58a07`), Cream/Yellow (`#f9f4d9`).
  - **Backgrounds:** Solid dark teal (`bg-teal-deep`) for primary surfaces (main content, sidebar), slightly lighter teal for cards/inputs. No gradients.
  - **Text:** Cream/yellow (`text-cream-yellow`) for primary text, lighter cream/gray (`text-cream-gray`) for secondary. High contrast against dark backgrounds.
  - **Accents:** Vibrant orange (`bg-orange-vibrant`, `border-orange-vibrant`) for primary actions, active states, focus rings. Cream/yellow (`border-cream-yellow`, `bg-cream-yellow`/`text-teal-deep`) for secondary buttons/borders.
- **Removed Elements:** Previous purple/blue palettes, background gradients, border gradients, purple text.
- **Animation System (Maintained):**
  - Fade-in transitions
  - Floating animations (subtle)
  - Hover transforms (scale, brightness adjustments)
  - Smooth transitions for color/layout changes.
- **Component Styling Examples:**
  - **Layout:** `grid-cols-[250px,1fr]` with `bg-teal-deep`. Sidebar has no right border. Logo container has no bottom border.
  - **Cards:** `bg-teal-light`, `rounded-lg`, `border border-cream-yellow/20`.
  - **Buttons (Primary):** `bg-orange-vibrant`, `text-white`, hover brightness increase.
  - **Buttons (Secondary):** `border border-cream-yellow`, `text-cream-yellow`, hover `bg-cream-yellow/10`.
  - **Navigation:** Active links use orange accent (e.g., left border or background). Hover states use subtle background change. No emojis.
  - **Inputs:** `bg-teal-light`, `border border-cream-yellow/30`, `text-cream-yellow`, focus ring `focus:ring-orange-vibrant`.

### 5. State Management
- Using local state for component data (useState)
- Implementing Firestore data fetching
- Planning real-time updates integration
- Considering React Context for global state
- Lifting state up to parent components when needed for shared components (e.g., `Notification.jsx` state managed in `CharacterWorkflowList.jsx`).
- Centralized state management for Character Workflow within `WorkflowEngine.jsx`.
- Implemented debounced autosave for workflow answers triggered by `QuestionCard.jsx` input changes, saving to subcollection.
- Logic added to `WorkflowEngine` to update parent workflow document `name` field.

### 6. File Storage Strategy
- Using Firebase Storage for file data
- Storing metadata in Firestore subcollections
- Maintaining consistent file paths (`projects/${projectId}/files/${filename}`)
- Implementing proper cleanup on deletion
- Handling file upload and deletion states
- Storing Character Workflow answers in Firestore subcollection: `characterWorkflows/{workflowId}/answers/{questionId}`.

### 7. Notes Management Strategy
- Storing notes in Firestore subcollections (`projects/${projectId}/notes`)
- Real-time sorting by creation timestamp
- Proper cleanup on deletion
- Loading states and validation
- Error handling for all operations
- Using Firebase Storage for file data
- Storing metadata in Firestore subcollections
- Maintaining consistent file paths (`projects/${projectId}/files/${filename}`)
- Implementing proper cleanup on deletion
- Handling file upload and deletion states

## Next Steps

### Recent Completions
4. **Password Reset Flow (2025-04-22)**
   - ✅ Added "Forgot password?" link to login form
   - ✅ Implemented `/reset-password` route with form validation
   - ✅ Integrated Firebase Auth password reset email flow
   - ✅ Added error handling and user feedback notifications
   - ✅ Adjusted landing page spacing for new UI element

### Immediate Tasks
2. Address orphaned workflow links and preferences persistence issues.
3. Implement drag-and-drop, rich text editing, and enhanced file previews.

### Upcoming Features
1. UI/UX Phase 2
   - Animations and transitions
   - Advanced form interactions
   - Drag-and-drop file upload
   - Rich text editing
2. Project Management
   - Enhanced file previews
   - Advanced note organization
   - Tag system with filtering
3. Settings enhancements
   - Theme customization
   - Layout preferences
   - Project templates
4. AI chatbox integration

## Active Considerations

### 1. Performance
- Monitoring initial load times
- Planning code splitting strategy
- Considering data fetching patterns
- Route-based bundle optimization
- Preference loading optimization:
  - Caching strategies
  - Real-time sync considerations
  - Default value handling
- Search optimization:
  - Debounced input handling
  - Client-side filtering
  - Future considerations:
    - Subcollection loading strategies
    - Pagination for large datasets
    - Indexed search for notes/files

### 2. User Experience
- Ensuring responsive design
- Planning loading states
- Implementing error boundaries
- Smooth route transitions
- Clear navigation feedback
- Consistent UI patterns
- Search interaction patterns:
  - Immediate feedback with debouncing
  - Clear visual indicators
  - Empty state handling
  - Efficient input clearing

### 3. Security
- Planning Firebase security rules
- Considering API key protection
- Preparing for user authentication
- Route access control

## Known Issues & Challenges
1. **(Resolved)** Landing page layout issues addressed by redesign.
2. Need to determine optimal Firebase data structure
3. Planning AI context retention strategy
4. Considering file upload size limits
5. Deciding on real-time update approach
6. Managing user preferences across sessions
7. Integrating preferences with AI behavior

## Development Environment
- Using Vite dev server
- Hot Module Replacement active
- Chrome DevTools for debugging
- VS Code with React extensions
- React Router DevTools

## Team Notes
- Following modular development approach
- Documenting component patterns
- Planning code review process
- Maintaining consistent code style

## Updates
2025-04-15: Consolidated and updated entries for the enhanced Character Workflow system, including config-driven engine, step-by-step UI, project linking/unlinking, view mode, autosave, resume logic fixes, layout adjustments, and associated new components. Removed `WorkflowSection.jsx` details as it was refactored out.
2025-04-15: Updated documentation to reflect the new "Retro Space" theme overhaul. Replaced previous color system (purple/blue/gradients) with deep teal, vibrant orange, and cream/yellow palette. Updated background, text, and accent color usage across components. Documented UI fixes including sidebar logo header, removal of sidebar emojis and borders, and workflow card button fix. Marked previous UI/UX Phase 2 as superseded where applicable.
2025-04-17: Documented completion of Landing Page Redesign & Fixes, including solid background color, logo placement, tagline, scroll fix, and Google button inline styling. Updated current focus and next steps to Password Reset. Marked previous landing page tasks as superseded/resolved.
2025-04-21: Documented Notes UI improvements (card styling, grid layout, smaller form buttons) in `ProjectNotes.jsx`.
2025-04-22: File and Note Management session — reviewed and confirmed implementation of project file upload, fetch, and delete features; verified note CRUD logic and user filtering; confirmed workflow engine creation/navigation; noted UI/UX feedback focus and need for further error handling and user notifications for file/note actions. See also `progress.md` and `tasks.md` for detailed task status.
2025-04-22: Home Page cycling quote and stats panel — implemented creative quote cycling with fade animation (Migra font, accent-cream color, top-left), cycling every 6s with no repeats; began stats panel structure for future activity feed/stats below quote. See also `progress.md` and `tasks.md` for details.
1. **UI Polish & Note Editing Refactor**
   - ✅ Added note deletion animation (`ProjectNotes.jsx`).
   - ✅ Implemented editor toolbar active states (`EditorToolbar.jsx`).
   - ✅ Fixed editor list buttons (CSS conflict resolved in `index.css`, `RichTextEditor.jsx`).
   - ✅ Simplified note editing logic in `ProjectNotes.jsx` and `ProjectDetail.jsx` to match note creation.
