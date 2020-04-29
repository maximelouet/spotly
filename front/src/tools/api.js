import tokenHelper from './tokenHelper';

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json',
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
  if (params) {
    return fetch(`${API_URL}${route}`, {
      signal,
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...params,
      }),
    }).then((r) => r.json());
  }
  return fetch(`${API_URL}${route}`, {
    headers,
  }).then((r) => r.json());
};

const authenticatedRequest = async (route, params = {}) => {
  if (!navigator.onLine) {
    controller.abort();
    throw new Error('No Internet connection');
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
    localStorage.setItem('expiresAt', tokenHelper.getExpirationTimestamp(authData.expires_in));
    accessToken = authData.access_token;
  }
  const body = JSON.stringify({
    accessToken,
    ...params,
  });

  return fetch(`${API_URL}${route}`, {
    signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then((r) => r.json());
};

export default {
  getAuthorizeUrl: async () => {
    const res = await request('/getAuthorizeUrl');
    return res.url;
  },
  exchangeCode: async (code) => request('/exchangeCode', { code }),
  getPlaybackState: async () => authenticatedRequest('/getPlaybackState'),
  getPlaybackLyrics: async () => authenticatedRequest('/getPlaybackLyrics'),
};
