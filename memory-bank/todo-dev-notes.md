# Writers AI Assistant – TODO & Tech Debt Tracker

This file tracks areas that were simplified during MVP development and need polish, error handling, or refactors later.

---

## 🚨 Error Handling Needed

- [ ] Wrap Firestore reads (getDocs, getDoc) in try/catch blocks  
- [ ] Show user-friendly error messages if Firebase fails  
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
- [ ] Add form auto-save functionality
- [ ] Implement real-time validation
- [ ] Add form state persistence

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
- [ ] Implement drag-and-drop:
  - File uploads
  - Note reordering
  - Card sorting
- [ ] Add advanced interactions:
  - Double-click to edit
  - Right-click context menus
  - Keyboard shortcuts
- [ ] Enhance visual feedback:
  - Progress indicators
  - Success/error states
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
