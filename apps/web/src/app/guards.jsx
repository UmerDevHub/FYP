import { Navigate, useLocation } from 'react-router';
import { Spinner } from '../components/ui.jsx';
import { useAuth } from './AuthProvider.jsx';

// These guards only decide what the screen shows. The server checks the role again on every
// request (FR-AU-06): hiding a page is never the only protection (NFR-SC-02).

function CheckingLogin() {
  return (
    <p className="flex items-center gap-2 text-muted" role="status">
      <Spinner /> Checking your login.
    </p>
  );
}

// Not logged in: go to the login page, and come back here after logging in.
export function RequireLogin({ children }) {
  const { user, isChecking } = useAuth();
  const location = useLocation();

  if (isChecking) return <CheckingLogin />;
  if (!user) return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  return children;
}

// Logged in with another role: a plain page that says so.
export function RequireRole({ roles, children }) {
  const { user } = useAuth();

  if (!roles.includes(user.role)) {
    return (
      <div>
        <h1 className="text-title">This page is not for your account</h1>
        <p className="mt-4">You are logged in, but your account cannot open this page.</p>
      </div>
    );
  }
  return children;
}
