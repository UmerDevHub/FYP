import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, restoreSession, setAccessToken, setLoginNeededHandler } from '../lib/api.js';

const AuthContext = createContext(null);

// Who is logged in, for the whole app. The access token stays in memory inside lib/api.js, never in
// localStorage (apps/web/CLAUDE.md). After a reload the refresh cookie brings the session back.
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Once at start-up. StrictMode runs this twice in development; restoreSession shares one call.
  useEffect(() => {
    restoreSession().then((restoredUser) => {
      setUser(restoredUser);
      setIsChecking(false);
    });
  }, []);

  // When a refresh fails during use, lib/api.js calls this.
  useEffect(() => {
    setLoginNeededHandler(() => {
      setUser(null);
      navigate('/login');
    });
  }, [navigate]);

  // Called by the login and register pages with the answer from the server.
  function startSession(session) {
    setAccessToken(session.accessToken);
    setUser(session.user);
  }

  // The server already ended the login (for example after a password reset): forget it here too.
  function endSession() {
    setAccessToken(null);
    setUser(null);
  }

  // A full reload at the home page: it wipes everything the old user's pages kept in memory, and no
  // guarded page is left open to send the person to /login on its way out.
  async function logOut() {
    await api('/auth/logout', { method: 'POST' });
    setAccessToken(null);
    window.location.assign('/');
  }

  return (
    <AuthContext.Provider value={{ user, isChecking, startSession, endSession, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
