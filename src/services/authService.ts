import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google sign-in popup...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Sign-in successful:', {
      user: result.user ? {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      } : null,
      credential: result.credential,
      operationType: result.operationType
    });
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('Error signing in with Google:', {
      code: authError.code,
      message: authError.message,
      customData: authError.customData
    });
    throw error;
  }
};

export const signOut = async () => {
  try {
    console.log('Signing out...');
    await firebaseSignOut(auth);
    console.log('Sign out successful');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  console.log('Setting up auth state change listener');
  return onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      providerId: user.providerId
    } : 'No user');
    if (user) {
      console.log('User details:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    }
    callback(user);
  });
};
