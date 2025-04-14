import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import Settings from './routes/Settings';
import CharacterWorkflow from './routes/CharacterWorkflow';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/character-workflow" element={<CharacterWorkflow />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
