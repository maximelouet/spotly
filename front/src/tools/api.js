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

export function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'NOTHING_PLAYING':
      return 'No song is currently playing.';
    case 'LYRICS_NOT_FOUND':
      return 'No lyrics found for this track.';
    default:
      return 'An error occurred.';
  }
}

export function getHtmlErrorMessage(errorCode) {
  switch (errorCode) {
    case 'NOTHING_PLAYING':
    case 'LYRICS_NOT_FOUND':
      return getErrorMessage(errorCode);
    default:
      return (
        <>
          An error occurred while connecting to the server:<br />
          <code>{ errorCode }</code>
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
