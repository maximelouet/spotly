import React from 'react';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3001';

const request = (route, params = {}, includeAccessToken = true) => {
  const accessToken = includeAccessToken && localStorage.getItem('accessToken');
  const body = !includeAccessToken ? JSON.stringify(params) : JSON.stringify({
    accessToken,
    ...params,
  });

  return fetch(`${API_URL}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then(r => r.json());
};

export function formatError(errorCode) {
  switch (errorCode) {
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
            <code>{ errorCode }</code>
          </p>
          <p>
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Try again</a>
          </p>
        </>
      );
  }
}

export default {
  getAuthorizeUrl: async () => {
    const res = await fetch(`${API_URL}/getAuthorizeUrl`).then(r => r.json());
    return res.url;
  },
  exchangeCode: async (code) => {
    return request('/exchangeCode', { code }, false);
  },
  getPlaybackLyrics: async () => {
    return request('/getPlaybackLyrics');
  },
}
