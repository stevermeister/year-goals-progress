import { User } from 'firebase/auth';
import { signOut } from '../services/authService';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="user-menu">
      {user.photoURL && <img src={user.photoURL} alt={user.displayName || 'User'} />}
      <span>{user.displayName}</span>
      <button onClick={handleLogout} className="logout-button">
        Sign Out
      </button>
    </div>
  );
}
