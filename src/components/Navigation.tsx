import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <Link 
        to="/" 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        📊 Dashboard
      </Link>
      <Link 
        to="/edit-goals" 
        className={`nav-item ${location.pathname === '/edit-goals' ? 'active' : ''}`}
      >
        ✏️ Edit Goals
      </Link>
      <Link 
        to="/add-progress" 
        className={`nav-item ${location.pathname === '/add-progress' ? 'active' : ''}`}
      >
        📝 Add Progress
      </Link>
    </nav>
  );
}
