# 🧠 Writers AI Assistant – Home Page & Workflow Design Plan

  

## ✅ Current Focus

Building the **Home Page** and designing the **Screenplay Workflows** starting with **Character Creation**.

  

---

  

## 🏠 Home Page Layout Ideas

  

### 1. Welcome & Quickstart Section

Display a friendly greeting and quick access buttons.

  

- Welcome message:

> "Welcome back, [userName]"

  

- Quick action buttons:

- **Start New Workflow**

- **Resume Saved Workflow**

- **Go to Projects**

  

---

  

### 2. User Progress Stats

Small, visual stat cards or icon pills showing the user’s creative activity.

  

- Projects Created: X

- Characters Defined: X

- Notes Written: X

- Workflows Completed: X

- Files Uploaded: X

  

---

  

### 3. Recent Activity Feed

Chronological log of recent events, like a project dashboard.

  

Examples:

- “You created *‘The Janitor’* 2 days ago.”

- “You added a new character to *‘October in a Red Dress’* yesterday.”

- “You completed the ‘Character Builder’ workflow.”

  

---

  

### 4. Featured Workflow (Rotating Highlight)

Spotlight a workflow the user can jump into directly.

  

Example:

> **Screenplay Character Builder**

> Build rich, emotionally grounded characters for your pilot or feature.

  

---

  

### 5. (Future) AI Suggestions Panel

Offer bite-sized writing prompts or ideas to keep the user inspired.

  

Examples:

- “Give your antagonist a secret they’re ashamed of.”

- “Try writing a scene with only subtext.”

- “What if your protagonist lied about everything?”

  

---

  

## ⚙️ Workflow Strategy & Design

  

### Format Structure (Balanced Approach)

1. Use structured, form-based workflows like the PDF (`Character Work`)

2. Under each question, include a:

- **"Need help?" AI Brainstorm Button**

- Opens a **small modal AI chat** scoped only to that question

- Allows short bursts of brainstorming without derailing the full workflow

  

### Why This Approach Works

- Keeps writers grounded and intentional

- Encourages real thought and reflection

- Supports creative blocks without doing all the work

- Avoids AI taking over the writing process

- Keeps workflows organized and goal-oriented

  

---

  

## ✍️ Next Workflow Plans

- [x] **Character Builder** (done)

- [ ] **TV Pilot Setup** (genre, theme, protagonist arc, hook)

- [ ] **Feature Film Builder** (3-act outline, tone, premise)

- [ ] **Songwriting Workflow** (theme, verse/chorus concepts, emotional core)

  

---

  

## 🔗 Workflow to Project Linking

Planned logic:

- Let user **link workflow to an existing project** (or create new)

- Workflow responses are stored under the selected project in Firestore

- Users can **view and edit saved workflows** from Project Detail view

  

—
