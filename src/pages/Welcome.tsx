import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './Welcome.css';

export function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstVisit = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'app');
        const prefsDoc = await getDoc(userPrefsRef);

        if (prefsDoc.exists() && prefsDoc.data()?.welcomeScreenSeen) {
          // User has seen welcome screen before, redirect to goals
          navigate('/goals');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking welcome screen status:', error);
        setLoading(false);
      }
    };

    checkFirstVisit();
  }, [user, navigate]);

  const handleGetInspired = async () => {
    if (!user) return;

    try {
      // Mark welcome screen as seen
      const userPrefsRef = doc(db, 'users', user.uid, 'preferences', 'app');
      await setDoc(userPrefsRef, {
        welcomeScreenSeen: true,
        seenAt: new Date().toISOString()
      });

      // Navigate to inspiration page
      navigate('/inspiration');
    } catch (error) {
      console.error('Error saving welcome screen status:', error);
    }
  };

  if (loading) {
    return (
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Make This Year Count</h1>
        <p className="welcome-intro-text">
          Choose your goals and start tracking progress effortlessly.
        </p>
        
        <div className="welcome-animation-container">
          <div className="welcome-progress-bar">
            <div className="welcome-progress-fill"></div>
          </div>
        </div>

        <button 
          className="welcome-cta-button"
          onClick={handleGetInspired}
        >
          Get Inspired
        </button>
      </div>
    </div>
  );
}
