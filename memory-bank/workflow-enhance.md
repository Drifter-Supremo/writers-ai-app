# Writers AI Assistant – React-Enhanced Workflow Blueprint

This document outlines the structure and features of an enhanced workflow system using the existing Character Builder as the first implementation. This blueprint will serve as the foundation for future workflows across other domains (e.g. TV pilots, songs, films).

---

## ✅ CURRENT STATE

- Character Builder workflow exists in basic form: one question at a time.
- Workflow data is saved to Firestore and can be resumed.
- Users can link workflows to projects.

---

## 🆕 GOAL

Rebuild the Character Builder workflow as a **modular, polished, and interactive React experience**, featuring:
- Reusable section-based layout
- Art for each question (optional but supported)
- Scoped AI brainstorm support
- Smart validation + autosave
- Flexible rendering format for future workflows

## This statment should be on the first page of the Character Builder workflow, explaing the purpose

- "Every great story starts with a compelling character. This workflow is designed to help you dig deep, explore your character’s personality, and uncover the quirks, contradictions, and hidden truths that make them feel real. By the end, you’ll know your character so well it’ll feel like you’ve met them in person and writing them will come naturally."
---

## 🔧 COMPONENT STRUCTURE

### `CharacterWorkflow.jsx`
Top-level route component for handling the full workflow experience.

```jsx
<Route path="/workflow/:workflowId" element={<CharacterWorkflow />} />

### `WorkflowEngine.jsx`

Reusable logic engine shared across all workflows. Accepts a config object describing the steps/questions.

<WorkflowEngine
  config={characterWorkflowConfig}
  workflowId={workflowId}
  projectId={linkedProjectId}
/>

### `WorkflowSection.jsx`

Renders a titled section with a list of questions. May be expandable/collapsible.

Props:

-   `title: string`
    
-   `questions: QuestionConfig[]`

### `QuestionCard.jsx`

Displays a single question (with optional AI button + image).

Props:

-   `questionId: string`
    
-   `prompt: string`
    
-   `type: 'text' | 'textarea' | 'select' | 'boolean'`
    
-   `imageSrc?: string`
    
-   `aiEnabled?: boolean`

### `AIHelperModal.jsx`

AI brainstorming assistant launched from a question. Scoped to that question’s prompt.

Props:

-   `prompt: string`
    
-   `context: string` (optional)
    
-   `onClose: () => void`
    

----------

### `WorkflowSidebar.jsx` _(Optional future upgrade)_

Allows navigation between sections, progress indicators, or linked project metadata.

----------

## 🧠 CONFIG-DRIVEN WORKFLOWS

All workflows are defined by a **config file** that powers the UI and logic.

Example:

export const characterWorkflowConfig = {
  title: "Character Builder",
  description: "Create a deep, nuanced character for your screenplay.",
  sections: [
    {
      title: "Core Identity",
      questions: [
        {
          id: "name",
          prompt: "What is this character’s name?",
          type: "text",
          image: "name.png",
        },
        {
          id: "nickname",
          prompt: "Do they have any nicknames?",
          type: "text",
          image: "nickname.png",
        },
        {
          id: "species",
          prompt: "Are they human, AI, alien, or something else?",
          type: "text",
          aiEnabled: true,
          image: "species.png"
        }
      ]
    },
    {
      title: "Personality & Behavior",
      questions: [
        {
          id: "flirtingResponse",
          prompt: "How do they respond to flirting?",
          type: "textarea",
          image: "flirting.png",
          aiEnabled: true
        },
        ...
      ]
    }
  ]
}

## FEATURE DETAILS

### 1. **Autosave per question**

-   Save each answer in Firestore under:
workflows/{workflowId}/answers/{questionId}

Show "Saving..." status or checkmark

### 2. **Scoped AI brainstorm**

-   Button under question: “Need help?”
    
-   Opens a modal with chat history + context from prior questions
    
-   Keeps brainstorming focused and avoids derailing
    

----------

### 3. **Progress Persistence**

-   User can leave and come back at any point
    
-   Resume from the last answered question
    
-   Optional: Add progress bar
    

----------

### 4. **Image Support**

-   Display optional image next to each question
    
-   Load from `/assets/workflows/{workflowId}/{imageFilename}`
    
-   Fallback to default icon if image is missing
    

----------

### 5. **Reusable Across Workflows**

This engine will also power other workflows:

-   TV Pilot Builder
    
-   Film Outline Workflow
    
-   Songwriting Prompter
    
-   Dialogue Workshop
    
-   Theme Explorer
    

All reuse the same:

-   `WorkflowEngine`
    
-   `QuestionCard`
    
-   `AIHelperModal`
    

Just swap the config.

----------

## 📁 Suggested File Structure

/src
  /workflows
    /components
      WorkflowEngine.jsx
      WorkflowSection.jsx
      QuestionCard.jsx
      AIHelperModal.jsx
    /configs
      characterWorkflowConfig.js
      tvPilotWorkflowConfig.js
    CharacterWorkflow.jsx
    TvPilotWorkflow.jsx

## 🔌 Integration with Firestore

Data path:

projects/{projectId}/workflows/{workflowId}
  - title
  - type
  - createdAt
  - lastUpdated
  - linkedToProject: true
  - answers/
    - {questionId}: string
## ✅ Minimum Viable Version

To launch the enhanced Character Workflow:

-   Set up `WorkflowEngine` and `characterWorkflowConfig`
    
-   Build `QuestionCard` with AI button + image support
    
-   Add autosave onBlur or debounce
    
-   Load/save from Firestore
    
-   Link to a project ID if chosen
    
-   Use static images for now (dynamic generation later)
    

----------

## 🧪 Later Enhancements

-   Section progress tracking
    
-   Workflow export/download
    
-   Shared workflows or templates
    
-   Drag-and-drop section reordering
    
-   Rating or feedback on completed workflows
