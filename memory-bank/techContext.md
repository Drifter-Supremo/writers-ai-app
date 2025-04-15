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

### 2. Tailwind Setup
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
        'creative-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        'creative-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      boxShadow: {
        'creative': '0 4px 20px -2px rgba(139, 92, 246, 0.1)',
        'creative-lg': '0 10px 30px -3px rgba(139, 92, 246, 0.15)'
      },
      ringColor: {
        'creative-purple': {
          200: '#ddd6fe',
          300: '#c4b5fd'
        }
      },
      ringOffsetColor: {
        'creative-purple': {
          100: '#f5f3ff'
        }
      },
      ringWidth: {
        '3': '3px'
      }
    }
  },
  plugins: []
}
```

### 3. Component Classes
```css
/* Base component classes */
.btn-creative {
  @apply bg-gradient-to-r from-creative-purple-500 to-creative-blue-500 
         text-white px-6 py-3 rounded-lg shadow-md 
         hover:from-creative-purple-600 hover:to-creative-blue-600 
         transform hover:-translate-y-0.5 transition-all duration-200
         font-medium disabled:opacity-50;
}

.card-creative {
  @apply bg-white/80 backdrop-blur-sm rounded-xl 
         shadow-creative border border-creative-purple-100 
         hover:shadow-creative-lg transition-all duration-300;
}

.input-creative {
  @apply w-full p-3 border-2 border-creative-purple-100 rounded-lg 
         focus:ring-2 focus:ring-purple-200 focus:ring-offset-2
         transition-all duration-200 placeholder-creative-purple-300;
}

.tag-creative {
  @apply bg-gradient-to-r from-creative-purple-100 to-creative-blue-50 
         px-4 py-2 rounded-full text-creative-purple-700 font-medium 
         shadow-sm hover:shadow transition-shadow duration-200;
}

.text-gradient {
  @apply bg-gradient-to-r from-creative-purple-900 to-creative-blue-600 
         bg-clip-text text-transparent;
}
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
- **Authentication**: User management
- **Security Rules**: Access control

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
