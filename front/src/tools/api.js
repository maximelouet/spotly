import React from 'react';
import logout from './logout';
import tokenHelper from './tokenHelper';

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json',
};

export function formatError(originalError) {
  const error = (originalError?.message) ? originalError.message : originalError;
  switch (error) {
    case 'NOTHING_PLAYING':
      return (
        <p>
          <span className="light-bold">No song is currently playing.</span>
        </p>
      );
    case 'LYRICS_NOT_FOUND':
      return (
        <p>
          <span className="light-bold">No lyrics found for this track.</span>
        </p>
      );
    case 'WAITING_FOR_FOCUS':
      return (
        <>
          <p>
            <span className="light-bold">Waiting for tab focus to load lyrics...</span>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Reload page
            </a>
          </p>
        </>
      );
    // may happen only if Spotify revokes the user's token
    case 'Unauthorized':
      return (
        <>
          <p>
            <span className="light-bold">An error occured (401).</span>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Reload page
            </a>
            <span> or try </span>
            <a
              href="/logout"
              onClick={(e) => { e.preventDefault(); logout(); }}
              className="link"
            >
              logging out
            </a>
            <span> and logging back in.</span>
          </p>
        </>
      );
    default:
      return (
        <>
          <p>
            <span className="light-bold">An error occurred:</span>
            <br />
            <code>{ error }</code>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Try again
            </a>
          </p>
        </>
      );
  }
}

const request = async (route, params) => {
  if (params) {
    return fetch(`${API_URL}${route}`, {
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
