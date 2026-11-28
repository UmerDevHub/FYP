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

const NO_SERVER_MESSAGE = 'We could not reach the server. Check your connection and try again.';

async function send(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include', // sends the httpOnly refresh cookie
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // No answer at all: offline, or the API is not running.
    throw new ApiRequestError(0, NO_SERVER_MESSAGE);
  }
}

// Our API always answers JSON. Anything else (for example a proxy error page while the API
// restarts) means the server could not be reached: never show the browser's technical text.
async function readAnswer(response) {
  try {
    return await response.json();
  } catch {
    throw new ApiRequestError(response.status, NO_SERVER_MESSAGE);
  }
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
  const answer = await readAnswer(response);
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

// Sends a file and reports how far the upload is (NFR-PF-03: the user sees the progress).
// fetch cannot report upload progress, so this one function uses XMLHttpRequest instead.
// onProgress gets a number from 0 to 100.
export function uploadWithProgress(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `${BASE_URL}${path}`);
    request.withCredentials = true;
    if (accessToken) {
      request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    }

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onerror = () => reject(new ApiRequestError(0, NO_SERVER_MESSAGE));
    request.onload = () => {
      let answer;
      try {
        answer = JSON.parse(request.responseText);
      } catch {
        reject(new ApiRequestError(request.status, NO_SERVER_MESSAGE));
        return;
      }
      if (request.status >= 400) {
        reject(new ApiRequestError(request.status, answer.error.message, answer.error.details));
        return;
      }
      resolve(answer);
    };

    request.send(formData);
  });
}
