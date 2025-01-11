import { useState, useEffect, useRef, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { User, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { removeUserData } from '../services/goalService';
import { Modal } from '../components/Modal';
import { AddGoalForm } from '../components/AddGoalForm';
import './UserMenu.css';

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (isConfirmOpen) {
          setIsConfirmOpen(false);
        } else if (isOpen) {
          closeMenu();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };

  }, [isOpen, isConfirmOpen]);

  // Reset focus index when menu closes
  useEffect(() => {
    if (!isOpen) {
      setFocusIndex(-1);
    }
  }, [isOpen]);

  // Handle focus when menu opens/closes
  useEffect(() => {
    if (isOpen && focusIndex >= 0) {
      menuItemsRef.current[focusIndex]?.focus();
    }
  }, [focusIndex, isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusIndex(prev => 
          prev < menuItemsRef.current.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusIndex(prev => 
          prev > 0 ? prev - 1 : menuItemsRef.current.length - 1
        );
        break;
      case 'Home':
        event.preventDefault();
        setFocusIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusIndex(menuItemsRef.current.length - 1);
        break;
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleRemoveData = async () => {
    if (!user) return;
    
    try {
      await removeUserData(user.uid);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { 
      label: 'Add Goal', 
      action: () => setIsAddGoalOpen(true),
      'aria-label': 'Add a new goal'
    },
    { 
      label: 'Remove All Data', 
      action: () => setIsConfirmOpen(true),
      className: 'danger',
      'aria-label': 'Remove all goals and progress data'
    },
    { 
      label: 'Sign Out', 
      action: handleSignOut,
      'aria-label': 'Sign out of your account'
    }
  ];

  return (
    <div 
      className="user-menu" 
      ref={menuRef}
      onKeyDown={handleKeyDown}
    >
      <button 
        ref={buttonRef}
        className="user-menu-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="user-menu-dropdown"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={`${user.displayName || 'User'}'s profile`}
            className="user-avatar"
          />
        ) : (
          <div 
            className="user-avatar-placeholder"
            role="img"
            aria-label={`${user.displayName || user.email || 'User'}'s profile picture placeholder`}
          >
            {(user.displayName?.[0] || user.email?.[0] || 'U').toUpperCase()}
          </div>
        )}
        <span className="user-name">{user.displayName || user.email || 'User'}</span>
      </button>

      {isOpen && (
        <div 
          id="user-menu-dropdown"
          className="menu-dropdown"
          role="menu"
          aria-label="User menu"
        >
          <Link to="/goals" className="menu-item">Goals</Link>
          <Link to="/history" className="menu-item">History</Link>
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              ref={el => menuItemsRef.current[index] = el}
              className={`menu-item ${item.className || ''}`}
              onClick={() => {
                item.action();
                closeMenu();
              }}
              role="menuitem"
              tabIndex={focusIndex === index ? 0 : -1}
              aria-label={item['aria-label']}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {isConfirmOpen && (
        <div 
          className="modal-overlay" 
          onClick={() => setIsConfirmOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div 
            className="confirm-modal" 
            onClick={e => e.stopPropagation()}
          >
            <h3 id="confirm-dialog-title">Remove All Data?</h3>
            <p>This action cannot be undone. All your goals and progress will be permanently deleted.</p>
            <div className="confirm-actions">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="cancel-button"
                autoFocus
              >
                Cancel
              </button>
              <button 
                onClick={handleRemoveData}
                className="confirm-button danger"
                aria-label="Permanently remove all goals and progress data"
              >
                Yes, Remove Everything
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Add Goal"
      >
        <AddGoalForm onClose={() => setIsAddGoalOpen(false)} />
      </Modal>
    </div>
  );
}
