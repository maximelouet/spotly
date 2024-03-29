import getExpirationTimestamp from './getExpirationTimestamp';

const API_URL = window._env_.API_URL ? window._env_.API_URL.replace(/\/$/, '') : 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json',
  'Spotly-Version': window._env_?.VERSION ? window._env_.VERSION : 'DEV',
};

const controller = new AbortController();
const { signal } = controller;

const request = async (route, params) => {
  if (!navigator.onLine) {
    controller.abort();
    throw new Error('No Internet connection');
  } else if (signal.aborted) {
    window.location.reload();
  }
  // Timeout requests after a reasonable time
  const timeoutMs = route.includes('AuthorizeUrl') ? 3000 : 7000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  if (params) {
    const result = await fetch(`${API_URL}${route}`, {
      signal,
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...params,
      }),
    }).then((r) => r.json());
    clearTimeout(timeoutId);
    return result;
  }
  const result = await fetch(`${API_URL}${route}`, {
    signal,
    headers,
  }).then((r) => r.json());
  clearTimeout(timeoutId);
  return result;
};

const authenticatedRequest = async (route, params = {}) => {
  if (!navigator.onLine) {
    controller.abort();
    throw new Error('NO_INTERNET');
  } else if (signal.aborted) {
    window.location.reload();
  }
  let accessToken = localStorage.getItem('accessToken');
  const expiresAt = new Date(localStorage.getItem('expiresAt') * 1000);
  const now = new Date();
  // refresh access token if it expires in less than 10 minutes (or is already expired)
  if (now.getTime() + (10 * 60 * 1000) > expiresAt.getTime()) {
    const authData = await request('/refreshToken', {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    if (!authData.access_token || !authData.expires_in) {
      throw new Error('Unable to refresh OAuth access token.');
    }
    localStorage.setItem('accessToken', authData.access_token);
    localStorage.setItem('expiresAt', getExpirationTimestamp(authData.expires_in));
    accessToken = authData.access_token;
  }
  const body = JSON.stringify({
    accessToken,
    ...params,
  });

  // Timeout requests after a reasonable time
  const timeoutMs = route.includes('Lyrics') ? 20000 : 12000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const result = await fetch(`${API_URL}${route}`, {
    signal,
    method: 'POST',
    headers,
    body,
  }).then((r) => r.json());
  clearTimeout(timeoutId);
  return result;
};

const getAuthorizeUrl = async () => {
  const res = await request('/getAuthorizeUrl');
  return res.url;
};
const exchangeCode = async (code) => request('/exchangeCode', { code });
const getPlaybackState = async () => authenticatedRequest('/getPlaybackState');
const getPlaybackLyrics = async () => authenticatedRequest('/getPlaybackLyrics');

export default {
  getAuthorizeUrl,
  exchangeCode,
  getPlaybackState,
  getPlaybackLyrics,
};
