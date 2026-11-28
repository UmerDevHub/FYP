import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, restoreSession, setAccessToken, setLoginNeededHandler } from './api.js';

function jsonAnswer(status, body) {
  return new Response(JSON.stringify(body), { status });
}

// A pretend server: /cars needs the token "new-token"; /auth/refresh hands it out when it works.
function createFakeServer({ isRefreshWorking = true } = {}) {
  return vi.fn(async (url, options) => {
    if (url === '/api/auth/refresh') {
      return isRefreshWorking
        ? jsonAnswer(200, { data: { accessToken: 'new-token', user: { id: 3, role: 'customer' } } })
        : jsonAnswer(401, { error: { message: 'Log in again.', details: null } });
    }
    if (options.headers.Authorization !== 'Bearer new-token') {
      return jsonAnswer(401, { error: { message: 'You need to log in first.', details: null } });
    }
    return jsonAnswer(200, { data: ['Corolla'] });
  });
}

function countCalls(fakeFetch, url) {
  return fakeFetch.mock.calls.filter(([calledUrl]) => calledUrl === url).length;
}

beforeEach(() => {
  setAccessToken(null);
  setLoginNeededHandler(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api', () => {
  it('sends the request to the API address with the cookies', async () => {
    const fakeFetch = vi.fn(async () => jsonAnswer(200, { data: [] }));
    vi.stubGlobal('fetch', fakeFetch);

    await api('/branches');

    const [url, options] = fakeFetch.mock.calls[0];
    expect(url).toBe('/api/branches');
    expect(options.credentials).toBe('include');
  });

  it('turns an error answer into an error with the message and details', async () => {
    vi.stubGlobal('fetch', async () =>
      jsonAnswer(400, {
        error: {
          message: 'Check the fields marked in red.',
          details: { year: ['Enter the year.'] },
        },
      }),
    );

    await expect(api('/sell-requests', { method: 'POST', body: {} })).rejects.toMatchObject({
      status: 400,
      message: 'Check the fields marked in red.',
      details: { year: ['Enter the year.'] },
    });
  });

  it('after a 401 it refreshes once and repeats the request once', async () => {
    const fakeFetch = createFakeServer();
    vi.stubGlobal('fetch', fakeFetch);

    const answer = await api('/cars');

    expect(answer).toEqual({ data: ['Corolla'] });
    expect(countCalls(fakeFetch, '/api/auth/refresh')).toBe(1);
    expect(countCalls(fakeFetch, '/api/cars')).toBe(2);
  });

  it('two calls that get a 401 at the same time share one refresh call', async () => {
    const fakeFetch = createFakeServer();
    vi.stubGlobal('fetch', fakeFetch);

    await Promise.all([api('/cars'), api('/cars')]);

    expect(countCalls(fakeFetch, '/api/auth/refresh')).toBe(1);
  });

  it('a failed refresh sends the person to the login page', async () => {
    vi.stubGlobal('fetch', createFakeServer({ isRefreshWorking: false }));
    const goToLogin = vi.fn();
    setLoginNeededHandler(goToLogin);

    await expect(api('/cars')).rejects.toMatchObject({ status: 401 });
    expect(goToLogin).toHaveBeenCalledOnce();
  });
});

describe('restoreSession (start-up after a reload)', () => {
  it('uses the refresh cookie to find out who is logged in', async () => {
    vi.stubGlobal('fetch', createFakeServer());

    expect(await restoreSession()).toEqual({ id: 3, role: 'customer' });
    // The new access token is kept in memory, so the next call is logged in.
    expect(await api('/cars')).toEqual({ data: ['Corolla'] });
  });

  it('two start-ups at once (React StrictMode) make one refresh call', async () => {
    const fakeFetch = createFakeServer();
    vi.stubGlobal('fetch', fakeFetch);

    await Promise.all([restoreSession(), restoreSession()]);

    expect(countCalls(fakeFetch, '/api/auth/refresh')).toBe(1);
  });

  it('gives null when nobody is logged in', async () => {
    vi.stubGlobal('fetch', createFakeServer({ isRefreshWorking: false }));

    expect(await restoreSession()).toBeNull();
  });
});
