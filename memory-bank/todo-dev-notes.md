# Writers AI Assistant – TODO & Tech Debt Tracker

This file tracks areas that were simplified during MVP development and need polish, error handling, or refactors later.

---

## 🚨 Error Handling Needed

- [ ] Wrap Firestore reads (getDocs, getDoc) in try/catch blocks  
- [x] Show user-friendly error messages if Firebase fails (Implemented `Notification.jsx` for feedback, replacing native alerts)
- [ ] Add 404 state to ProjectDetail page if project ID doesn't exist
- [ ] Add error handling for file upload failures
- [ ] Handle duplicate file names in Storage
- [ ] Add loading state for file deletion
- [ ] Handle Storage quota exceeded errors

---

## ✅ Validation & Form Logic

- [ ] Add form validation UI (error messages, disabled submit, etc.)  
- [ ] Validate file types before upload
- [ ] Add file size limits and validation
- [x] Add form auto-save functionality (Implemented for Character Workflow via `WorkflowEngine` and debounced `QuestionCard` updates)
- [ ] Implement real-time validation (Beyond basic required/format checks)
- [ ] Add form state persistence (e.g., across page reloads for non-workflow forms)

---

## 💅 UI/UX Polish

### Phase 2 Tasks
- [ ] Implement sidebar collapse animation
- [ ] Add smooth section transitions
- [ ] Enhance form interactions
  - Floating labels
  - Inline validation
  - Auto-save drafts
- [ ] Add loading skeletons for:
  - Project cards
  - File list
  - Notes section
  - [x] Character Workflow list (`Workflows.jsx`)
  - [x] Project list in Link Workflow modal (`LinkWorkflowModal.jsx`)
  - [x] Character Workflow Engine (`WorkflowEngine.jsx` while loading config/answers)
- [x] Added skeleton loaders for project cards on the Projects Dashboard to improve loading feedback
- [ ] Implement drag-and-drop:
  - File uploads
  - Note reordering
  - Card sorting
- [ ] Add advanced interactions:
  - Double-click to edit
  - Right-click context menus
  - Keyboard shortcuts
- [ ] Enhance visual feedback:
  - Progress indicators (e.g., for Character Workflow completion)
  - [x] Success/error states (Implemented `Notification.jsx` for link/unlink actions, need general implementation)
  - Tooltips
- [ ] Improve accessibility:
  - ARIA labels
  - Focus management
  - Screen reader support

### Future Enhancements
- [ ] Add dark mode support
- [ ] Implement custom themes
- [ ] Add animation preferences
- [ ] Create component presets

---

## 🧠 Component Architecture

- [ ] Create reusable FileUploader component
- [ ] Extract file management logic into custom hooks
- [ ] Implement shared layout components
- [ ] Create form component library
- [ ] Add component documentation
- [ ] Set up Storybook for component development

---

## 🧪 Testing / Stability

- [ ] Handle Firebase permission errors (if auth is added)  
- [ ] Handle offline or failed network requests  
- [ ] Confirm createdAt is stored consistently
- [ ] Test file upload with large files
- [ ] Test concurrent file operations
- [ ] Verify file cleanup on deletion
- [ ] Add component unit tests
- [ ] Set up E2E testing

---

## 🔮 Future Enhancements

### UI/UX Features
- [ ] Advanced project organization:
  - Custom views (list/grid/kanban)
  - Advanced sorting options
  - Bulk actions
- [ ] Enhanced file management:
  - File preview system
  - Version history
  - File categorization
- [ ] Note improvements:
  - Rich text editor
  - Note templates
  - Note categories
- [ ] Search enhancements:
  - Advanced filters
  - Saved searches
  - Global search

### System Features
- [ ] User preferences:
  - Layout customization
  - Theme builder
  - Keyboard shortcut editor
- [ ] Project templates:
  - Custom layouts
  - Default settings
  - Shared configurations
- [ ] Advanced data features:
  - Real-time collaboration
  - Version control
  - Data export/import
- [ ] Performance optimizations:
  - Code splitting
  - Lazy loading
  - Caching strategies
- [ ] Character Workflow Enhancements:
  - [ ] Implement actual AI calls in `AIHelperModal.jsx` (currently placeholder).
  - [ ] Add workflow progress indicator/steps UI.
  - [ ] Consider adding different question input types (e.g., multiple choice, sliders) to config and `QuestionCard`.
  - [ ] Add validation rules to workflow config and enforce in `QuestionCard`/`WorkflowEngine`.

---

## 📝 Implementation Notes

### Component Best Practices
- Keep components focused and single-responsibility
- Use consistent prop patterns
- Implement proper error boundaries
- Add loading states for async operations
- Use TypeScript for better type safety

### Performance Considerations
- Monitor bundle size
- Implement proper code splitting
- Use proper caching strategies
- Optimize Firebase queries
- Consider implementing service workers

### Accessibility Guidelines
- Follow WCAG 2.1 standards
- Implement proper keyboard navigation
- Add screen reader support
- Maintain proper color contrast
- Add proper ARIA labels

## Updates
2025-04-15: Updated TODOs to reflect the completion of the enhanced Character Workflow. Marked workflow autosave as implemented. Added new TODOs for implementing the AI Helper modal functionality, adding workflow progress indicators, and potential future workflow enhancements (input types, validation). Marked skeleton loader TODO for the workflow engine as complete.
