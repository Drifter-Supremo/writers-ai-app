import React from 'react'; // Import React for Suspense/lazy
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import LandingPage from './routes/LandingPage';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Settings from './routes/Settings';
const CharacterWorkflow = React.lazy(() => import('./workflows/CharacterWorkflow'));
import Workflows from './routes/Workflows';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ResetPassword from './routes/ResetPassword';

export default function App() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg text-cream-yellow text-xl">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <LandingPage />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/workflows"
                  element={
                    <ProtectedRoute>
                      <Workflows />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/character-workflow"
                  element={
                    <ProtectedRoute>
                      <React.Suspense fallback={<div>Loading Workflow...</div>}>
                        <CharacterWorkflow />
                      </React.Suspense>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
