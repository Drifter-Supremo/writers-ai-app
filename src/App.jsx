import React from 'react'; // Import React for Suspense/lazy
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Settings from './routes/Settings';
const CharacterWorkflow = React.lazy(() => import('./workflows/CharacterWorkflow')); // Update path and use lazy
import Workflows from './routes/Workflows'; // Import the new component

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workflows" element={<Workflows />} /> {/* Add the new route */}
          <Route
            path="/character-workflow" // Path remains the same
            element={
              <React.Suspense fallback={<div>Loading Workflow...</div>}>
                <CharacterWorkflow /> {/* Point to the new component */}
              </React.Suspense>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
