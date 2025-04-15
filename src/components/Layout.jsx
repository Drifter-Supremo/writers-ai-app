import { useLocation, Link } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar wrapper - prepared for future collapsible state */}
      <div className="w-64 transition-width duration-300">
        {/* Fixed sidebar */}
        {/* Remove border-r */}
        <div className="fixed h-full w-64 bg-primary-bg text-text-primary shadow-md">
          {/* Logo/title section */}
          {/* Remove border-b */}
          <div className="p-6 flex justify-center">
            <Link to="/" aria-label="Home">
              <img
                src="/assets/logo-no-background.png"
                alt="Writers AI Assistant Logo"
                // Increase logo size
                className="h-16 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Navigation items - Use new colors */}
          <nav className="p-4 space-y-2">
            <a
              href="/"
              // Remove emoji span, adjust spacing if needed (removed space-x-3)
             // Remove border-l-4 from active and hover states
             className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
               location.pathname === '/'
                 ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium' // Restore active border
                 : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1' // Keep hover border removed
             }`}
           >
             {/* <span>🏠</span> */}
             <span>Home</span>
           </a>
           <a
             href="/projects"
              // Remove emoji span, adjust spacing if needed (removed space-x-3)
              // Remove border-l-4 from active and hover states
             className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
               location.pathname === '/projects'
                 ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium' // Restore active border
                 : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1' // Keep hover border removed
             }`}
           >
             {/* <span>📚</span> */}
             <span>Projects</span>
           </a>
           <a
             href="/workflows"
              // Remove emoji span, adjust spacing if needed (removed space-x-3)
              // Remove border-l-4 from active and hover states
             className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
               location.pathname === '/workflows'
                 ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium' // Restore active border
                 : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1' // Keep hover border removed
             }`}
           >
             {/* <span>⚡️</span> */}
             <span>Workflows</span>
           </a>
           <a
             href="/settings"
              // Remove emoji span, adjust spacing if needed (removed space-x-3)
              // Remove border-l-4 from active and hover states
             className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
               location.pathname === '/settings'
                 ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium' // Restore active border
                 : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1' // Keep hover border removed
             }`}
           >
             {/* <span>⚙️</span> */}
             <span>Settings</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main content */}
      {/* Main content - Use new primary-bg */}
      <div className="flex-1 overflow-auto bg-primary-bg">
        <main className="p-8 min-h-screen w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
