import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow">
      <div className="text-xl font-bold">
        Writers AI Assistant
      </div>
      <div className="flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        <Link to="/projects" className="text-blue-600 hover:underline">
          Projects
        </Link>
        <Link to="/settings" className="text-blue-600 hover:underline">
          Settings
        </Link>
      </div>
    </nav>
  );
}
