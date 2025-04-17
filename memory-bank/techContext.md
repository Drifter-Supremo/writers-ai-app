# Technical Context

## Development Stack

### Core Technologies
- **React 18** with Vite for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Firebase** for backend services
- **Gemini Flash 2.0** for AI capabilities

## Development Environment

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- Firebase CLI
- Google Cloud CLI (for Gemini API)

### Project Setup
```bash
# Clone and install dependencies
git clone [repository]
cd writers-ai-app
npm install

# Start development server
npm run dev
```

## Configuration Details

### 1. Vite Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}
```

### 2. Tailwind Setup ("Retro Space" Theme)
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'teal-deep': '#0f303d',      // Primary background (dark teal/green)
        'teal-light': '#1a4c5d',     // Secondary background (cards, inputs)
        'orange-vibrant': '#f58a07', // Accent color (buttons, active states, focus)
        'cream-yellow': '#f9f4d9',   // Primary text, secondary borders/buttons
        'cream-gray': '#d1cbbd',     // Secondary text (lighter cream/gray)
        // Removed 'creative-purple' and 'creative-blue' palettes
      },
      animation: { // Animations likely kept, potentially adjusted
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out' // Example: Faster fade-in
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' } // Example: More subtle float
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      // Removed theme-specific boxShadow, ringColor, ringOffsetColor, ringWidth
      // Focus rings now likely use default outline or orange-vibrant:
      // e.g., focus:ring-orange-vibrant
      fontFamily: { // Example: If a custom font was added
        // sans: ['"Your Retro Font"', 'sans-serif'],
      }
    }
  },
  plugins: []
}
```


### 3. Component Styling Approach ("Retro Space" Theme)

**Note:** With the "Retro Space" theme, the previous `@apply` based custom classes (`.btn-creative`, `.card-creative`, etc.) may be superseded or significantly altered. Styling is now primarily achieved by directly applying Tailwind utility classes using the new theme colors (`teal-deep`, `teal-light`, `orange-vibrant`, `cream-yellow`, `cream-gray`).

Below are examples of how components might be styled using direct utility classes under the new theme:

```jsx
// Example Primary Button (using direct utilities)
<button className="bg-orange-vibrant text-white px-4 py-2 rounded-md font-medium hover:brightness-110 transition duration-200 disabled:opacity-60">
  Primary Action
</button>

// Example Secondary Button (using direct utilities)
<button className="border border-cream-yellow text-cream-yellow px-4 py-2 rounded-md font-medium hover:bg-cream-yellow/10 transition duration-200 disabled:opacity-60">
  Secondary Action
</button>

// Example Card (using direct utilities)
<div className="bg-teal-light p-6 rounded-lg border border-cream-yellow/20 shadow-sm">
  {/* Card Content */}
</div>

// Example Input Field (using direct utilities)
<input
  type="text"
  className="w-full p-3 bg-teal-light border border-cream-yellow/30 rounded-md text-cream-yellow placeholder-cream-gray/70 focus:ring-2 focus:ring-orange-vibrant focus:border-orange-vibrant focus:outline-none transition duration-200"
  placeholder="Enter text..."
/>

// Example Tag/Badge (using direct utilities)
<span className="bg-orange-vibrant/20 text-orange-vibrant px-3 py-1 rounded-full text-sm font-medium">
  Tag
</span>

// Note: Gradient text (.text-gradient) is likely removed as solid colors are preferred.
```

### 3. Firebase Configuration
```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxm3KU_zskuetIJghqs6mJUrBBXOwNBvk",
  authDomain: "gorlea-notebook.firebaseapp.com",
  projectId: "gorlea-notebook",
  storageBucket: "gorlea-notebook.firebasestorage.app",
  messagingSenderId: "765002073529",
  appId: "1:765002073529:web:f5233102c891b197616268"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
```

### 4. Firestore Usage Patterns
```javascript
// Data Fetching (Projects.jsx)
const [projects, setProjects] = useState([]);

useEffect(() => {
  async function fetchProjects() {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(projectsData);
  }
  fetchProjects();
}, []);

// Workflow Answer Saving (WorkflowEngine.jsx / QuestionCard.jsx)
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// ... inside component ...
const saveAnswer = async (workflowId, questionId, answerValue) => {
  const answerRef = doc(db, "characterWorkflows", workflowId, "answers", questionId);
  try {
    await setDoc(answerRef, {
      value: answerValue, // Ensure field name is 'value'
      lastUpdated: Timestamp.now() // Use Timestamp.now() for consistency
    }, { merge: true });
    console.log("Answer saved successfully for question:", questionId);
  } catch (error) {
    console.error("Error saving answer:", error);
  }
};

// Workflow Answer Loading (WorkflowEngine.jsx)
import { collection, getDocs } from "firebase/firestore";
// ... inside component ...
const loadAnswers = async (workflowId) => {
  const answers = {};
  const answersRef = collection(db, "characterWorkflows", workflowId, "answers");
  try {
    const querySnapshot = await getDocs(answersRef);
    querySnapshot.forEach((doc) => {
      answers[doc.id] = doc.data()?.value; // Ensure field name is 'value'
    });
    console.log("Answers loaded successfully");
    return answers;
  } catch (error) {
    console.error("Error loading answers:", error);
    return {}; // Return empty object on error
  }
};

// Workflow Name Update (WorkflowEngine.jsx)
import { doc, updateDoc } from "firebase/firestore";
// ... inside saveAnswer function ...
if (questionId === 'name') {
  const workflowRef = doc(db, 'characterWorkflows', workflowId);
  await updateDoc(workflowRef, { name: value || 'Untitled Character Workflow' });
}
```

### 5. Workflow Configuration Pattern
- The enhanced Character Workflow utilizes a JavaScript configuration file (`src/workflows/configs/characterWorkflowConfig.js`).
- This config defines the structure, sections, questions, question types, and associated images for the workflow.
- The `WorkflowEngine.jsx` component reads this configuration to dynamically render the workflow UI using `WorkflowSection.jsx` and `QuestionCard.jsx`.
- This pattern allows for easier modification and creation of new workflows without changing the core engine components. Example structure:
```javascript
// src/workflows/configs/characterWorkflowConfig.js (Simplified Example)
export const characterWorkflowConfig = {
  id: 'character-creation-v1',
  title: 'Character Creation Workflow',
  sections: [
    {
      id: 'section-1',
      title: 'Basic Concept',
      questions: [
        { id: 'q1', text: 'Character Name?', type: 'text', image: '/assets/workflows/name.png' },
        { id: 'q2', text: 'Logline/Concept?', type: 'textarea', image: '/assets/workflows/concept.png' },
      ]
    },
    // ... more sections
  ]
};
```

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "firebase": "^10.x", // Core Firebase SDK
  "@google/generative-ai": "^0.1.x", // For Gemini AI
  "tailwindcss": "^3.x", // Utility CSS framework
  // Note: lodash.debounce was not used, debounce implemented with native JS
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.x",
  "vite": "^5.x",
  "postcss": "^8.x",
  "autoprefixer": "^10.x"
}
```

## API Integration

### 1. Firebase Services
- **Firestore**: Document database
- **Storage**: File storage
- **Authentication**: User management (Email/Password and Google sign-in via Firebase Auth, managed with AuthContext and protected routes)
- **Security Rules**: Access control

#### Authentication Integration
- **AuthContext**: Provides global user state, loading, error, and authentication actions (login, signup, Google sign-in, logout) via React Context.
- **ProtectedRoute**: Guards all private routes, redirecting unauthenticated users to `/login`.
- **Sidebar Auth-Aware UI**: Sidebar navigation displays "Sign In" and "Sign Up" when logged out, and user info with "Logout" when logged in.
- **Login/Signup Pages**: `/login` and `/signup` routes provide forms for Email/Password and Google authentication, with error handling and loading states.
- **Character Workflow User Isolation**: All workflow creation, queries, and security rules use userId for multi-user support. Only the current user's workflows are visible and accessible after login.
- **Post-Login/Signup Redirect**: After login or signup, users are redirected to the home page (`/`) instead of `/projects`.
- **Multi-User Data Isolation**: All Firestore documents (projects, files, notes, preferences, workflows) use userId for per-user access, enforced in both code and security rules.
- **Landing Page**: Standalone page (`/`) with full-screen background image (`background-size: contain`), no sidebar/nav. Sign-in box is absolutely positioned below the logo area in the image, using responsive offsets.

### 2. Gemini Flash 2.0
- API endpoint configuration
- Rate limiting setup
- Error handling
- Response caching

## Build & Deployment

### Development
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

### Production
- Hosting: Firebase Hosting
- CI/CD: GitHub Actions
- Environment: Node.js production server

## Security Considerations

### 1. API Security
- Firebase security rules
- API key management
- Rate limiting
- Input validation

### 2. Data Protection
- User data encryption
- Secure file storage
- Session management
- CORS configuration

## Performance Optimization

### 1. Build Optimization
- Code splitting
- Tree shaking
- Asset optimization
- Lazy loading

### 2. Runtime Optimization
- Memoization
- Virtual scrolling
- Image optimization
- Cache management

## Monitoring & Debugging

### 1. Development Tools
- React DevTools
- Firebase Console
- Chrome DevTools
- Vite HMR

### 2. Production Monitoring
- Firebase Analytics
- Error tracking
- Performance monitoring
- Usage analytics

## Updates
2025-04-15: Updated Firestore usage patterns for workflow answers (using `value` field, `Timestamp.now()`). Added example for updating parent workflow document name. Corrected dependencies (debounce implemented natively).
2025-04-15: Updated Tailwind Setup section to reflect the new "Retro Space" theme colors (`teal-deep`, `teal-light`, `orange-vibrant`, `cream-yellow`, `cream-gray`) and removed the old purple/blue palettes and related theme extensions. Updated the Component Classes section to note the shift towards direct utility class application and provided examples using the new theme. Marked old `@apply` classes as likely superseded.
