import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar wrapper - prepared for future collapsible state */}
      <div className="w-64 transition-width duration-300">
        {/* Fixed sidebar */}
        <div className="fixed h-full w-64 bg-gradient-to-b from-creative-purple-800 via-creative-purple-900 to-creative-blue-900 text-white shadow-creative-lg backdrop-blur-sm">
          {/* Logo/title section */}
          <div className="bg-white/5 p-8 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-creative-blue-200 to-creative-purple-200 bg-clip-text text-transparent">
              Writers AI Assistant
            </h1>
          </div>

          {/* Navigation items */}
          <nav className="p-4 space-y-2">
            <a 
              href="/"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'bg-white/10 text-white border-l-4 border-creative-blue-400 shadow-lg shadow-black/20 font-medium' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:border-l-4 hover:border-creative-purple-400'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </a>
            <a 
              href="/projects"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/projects' 
                  ? 'bg-white/10 text-white border-l-4 border-creative-blue-400 shadow-lg shadow-black/20 font-medium' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:border-l-4 hover:border-creative-purple-400'
              }`}
            >
              <span>📚</span>
              <span>Projects</span>
            </a>
            <a
              href="/workflows"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/workflows'
                  ? 'bg-white/10 text-white border-l-4 border-creative-blue-400 shadow-lg shadow-black/20 font-medium'
                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:border-l-4 hover:border-creative-purple-400'
              }`}
            >
              <span>⚡️</span>
              <span>Workflows</span>
            </a>
            <a 
              href="/settings"
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/settings' 
                  ? 'bg-white/10 text-white border-l-4 border-creative-blue-400 shadow-lg shadow-black/20 font-medium' 
                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:border-l-4 hover:border-creative-purple-400'
              }`}
            >
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-creative-purple-50/30 to-creative-blue-50/30">
        <main className="p-8 min-h-screen w-full backdrop-blur-[2px]">
          {children}
        </main>
      </div>
    </div>
  );
}
