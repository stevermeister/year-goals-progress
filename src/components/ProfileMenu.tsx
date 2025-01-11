import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profile-menu">
      <button 
        className="profile-button"
        onClick={toggleMenu}
      >
        Menu
      </button>
      {isOpen && (
        <div className="profile-dropdown">
          <Link 
            to="/" 
            className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/edit-goals" 
            className={`menu-item ${location.pathname === '/edit-goals' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Edit Goals
          </Link>
          <Link 
            to="/add-progress" 
            className={`menu-item ${location.pathname === '/add-progress' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Add Progress
          </Link>
        </div>
      )}
    </div>
  );
}
