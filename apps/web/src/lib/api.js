// The one way the screens talk to the API. Pages call hooks, hooks call api(); nothing calls fetch.

// In development Vite passes /api on to the API server (vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

// The access token lives in memory only, never in localStorage (apps/web/CLAUDE.md). S2 sets it at login.
let accessToken = null;
// While a refresh is running, every caller waits for this same promise.
let refreshPromise = null;
// S2 connects this to the router; until then it simply opens the login address.
let handleLoginNeeded = () => window.location.assign('/login');

export function setAccessToken(token) {
  accessToken = token;
}

export function setLoginNeededHandler(handler) {
  handleLoginNeeded = handler;
}

export class ApiRequestError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function send(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include', // sends the httpOnly refresh cookie
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

// Only one refresh at a time: React StrictMode runs effects twice in development, and two
// refresh calls with the same cookie would cancel each other and log the person out (S2).
// Gives the new session ({ accessToken, user }), or null when the person must log in again.
function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null;
        const answer = await response.json();
        setAccessToken(answer.data.accessToken);
        return answer.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Sends a request and returns the answer ({ data } or { data, meta }). An error answer is thrown.
export async function api(path, options = {}) {
  // A 401 only means "the access token ran out" when a token was sent. Without one (for example
  // a wrong login) the 401 is the server's real answer and its message is shown as it is.
  const wasTokenSent = accessToken !== null;
  let response = await send(path, options);

  if (response.status === 401 && wasTokenSent) {
    const session = await refreshAccessToken();
    if (!session) {
      handleLoginNeeded();
      throw new ApiRequestError(401, 'You need to log in first.');
    }
    response = await send(path, options);
  }

  if (response.status === 204) return null;
  const answer = await response.json();
  if (!response.ok) {
    throw new ApiRequestError(response.status, answer.error.message, answer.error.details);
  }
  return answer;
}

// After a reload the access token is gone (it lived in memory), but the httpOnly refresh cookie
// is still there. One refresh call finds out who is logged in. Gives the user, or null.
export async function restoreSession() {
  const session = await refreshAccessToken();
  return session ? session.user : null;
}
