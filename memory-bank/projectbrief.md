## **🛠️ Writers AI Assistant – Dev Brief (Recovered Version)**

### **🔹 Project Purpose**

A personalized, AI-powered web app to help writers (screenwriters, novelists, songwriters) manage their creative projects in one place.  
 It stores characters, themes, notes, and uploaded scripts per project—and includes an AI assistant that remembers context and offers creative support.

---

### **📁 Folder Structure (Modular from Start)**

css  
CopyEdit  
`src/`  
`├─ App.jsx`  
`├─ main.jsx`  
`├─ routes/`  
`│  ├─ Home.jsx`  
`│  ├─ Projects.jsx`  
`│  ├─ ProjectDetail.jsx`  
`│  └─ Settings.jsx`  
`├─ components/`  
`│  ├─ Navbar.jsx`  
`│  └─ ProjectCard.jsx`  
`├─ services/`  
`│  └─ firebase.js`  
`├─ styles/`  
`│  └─ index.css`

✅ Clean, modular from the beginning to **avoid painful refactoring later**

---

### **🔥 Firebase Setup**

* ✅ Firebase project already created

* ✅ Config info is ready

* Will use **Firestore** for per-project memory (project name, characters, notes, uploads, etc.)

* Config stored inside `src/services/firebase.js`

* DO NOT expose config in the frontend after we move to secure API calls

---

### **🤖 AI Assistant Details**

* Powered by **Gemini Flash 2.0** (via Google GenAI API)

* Provides **project-aware suggestions**, rewrites, and feedback

* Stored memory per project in **Firestore**

* Will eventually have a full **AI chatbox per project**

---

### **🧱 UI Plan (Phase 1\)**

1. **Dashboard layout**

   * Displays existing projects as cards

   * “New Project” button

2. **Project Detail View**

   * Upload file, add notes, access AI chat

3. **AI Chatbox**

   * Embedded in ProjectDetail

   * Chat assistant responds using project memory

4. **Settings page**

   * For tone, assistant personality, etc.

---

### **🧠 Cline Workflow Strategy**

* Use **one clear prompt at a time**

* Avoid vague “generate the whole thing” prompts

* Use **scoped, modular code tasks**

* Always define **where code goes**, and label sections

* Use `// STEP:` or `// FILE:` comments for clarity

* Ask Cline to **create new files when needed**, not dump everything into App.jsx

---

### **🛣️ Short-Term Roadmap**

1. ✅ Configure Tailwind

2. ✅ Set up folder structure

3. ⏳ Build dashboard skeleton (Projects page \+ cards)

4. ⏳ Connect Firebase (`firebase.js`)

5. ⏳ Project creation \+ memory storage

6. ⏳ Add file upload support

7. ⏳ Add AI chatbox

8. ⏳ Integrate Gemini Flash 2.0

