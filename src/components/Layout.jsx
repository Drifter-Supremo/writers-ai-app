import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, authLoading } = useAuth();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar wrapper - prepared for future collapsible state */}
      <div className="w-64 transition-width duration-300">
        {/* Fixed sidebar */}
        {/* Remove border-r */}
        <div className="fixed h-full w-64 bg-primary-bg text-text-primary shadow-md flex flex-col">
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
          <nav className="p-4 space-y-2 flex-1">
            <a
              href="/"
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium'
                  : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1'
              }`}
            >
              <span>Home</span>
            </a>
            <a
              href="/projects"
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/projects'
                  ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium'
                  : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1'
              }`}
            >
              <span>Projects</span>
            </a>
            <a
              href="/workflows"
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/workflows'
                  ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium'
                  : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1'
              }`}
            >
              <span>Workflows</span>
            </a>
            <a
              href="/settings"
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-accent-orange text-primary-bg border-l-4 border-accent-orange shadow-lg shadow-black/20 font-medium'
                  : 'text-text-secondary hover:bg-accent-orange/80 hover:text-primary-bg hover:translate-x-1'
              }`}
            >
              <span>Settings</span>
            </a>
          </nav>
          {/* Auth section at bottom */}
          <div className="p-4 border-t border-cream-gray/20 mt-auto">
            {authLoading ? (
              <div className="text-text-secondary text-sm">Loading...</div>
            ) : user ? (
              <div className="flex flex-col items-start gap-2">
                <div className="text-text-primary text-sm break-all">
                  {user.displayName || user.email}
                </div>
                <button
                  className="btn-creative-secondary w-full"
                  onClick={async () => {
                    await logout();
navigate('/');
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  className="btn-creative w-full"
onClick={() => navigate('/')}
                >
                  Sign In
                </button>
                <button
                  className="btn-creative-secondary w-full"
onClick={() => navigate('/')}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-primary-bg">
        <main className="p-8 min-h-screen w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
