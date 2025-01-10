import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from 'firebase/auth';

interface UserMenuProps {
  user: User | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-menu">
      <img 
        src={user.photoURL || '/default-avatar.png'} 
        alt={user.displayName || 'User'} 
        className="user-avatar" 
      />
      <span className="user-name">{user.displayName}</span>
      <button onClick={handleSignOut} className="sign-out-button">
        Sign Out
      </button>
    </div>
  );
}
