import React from 'react';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3001';
const headers = {
  'Content-Type': 'application/json',
};

export function formatError(error) {
  if (error?.message) {
    error = error.message;
  }
  switch (error) {
    case 'NOTHING_PLAYING':
      return <p><span className="light-bold">No song is currently playing.</span></p>;
    case 'LYRICS_NOT_FOUND':
      return <p><span className="light-bold">No lyrics found for this track.</span></p>;
    default:
      return (
        <>
          <p>
            <span className="light-bold">An error occurred while connecting to the server:</span>
            <br />
            <code>{ error }</code>
          </p>
          <p>
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Try again</a>
          </p>
        </>
      );
  }
}

const request = (route, params) => {
  if (params) {
    return fetch(`${API_URL}${route}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...params,
      }),
    }).then(r => r.json());
  }
  return fetch(`${API_URL}${route}`, {
    headers,
  }).then(r => r.json());
};

const authenticatedRequest = (route, params = {}) => {
  const accessToken = localStorage.getItem('accessToken');
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
  }).then(r => r.json());
};

export default {
  getAuthorizeUrl: async () => {
    const res = await request('/getAuthorizeUrl');
    return res.url;
  },
  exchangeCode: async (code) => {
    return request('/exchangeCode', { code });
  },
  getPlaybackLyrics: async () => {
    return authenticatedRequest('/getPlaybackLyrics');
  },
}
