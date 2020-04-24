import React, { useEffect, useState } from 'react';
import api, { formatError } from '../tools/api';
import s from './SpotifyCallback.module.css';

function SpotifyCallback() {
  const [error, setError] = useState(false);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    async function exchangeCode() {
      try {
        const authData = await api.exchangeCode(code);
        localStorage.setItem('accessToken', authData.access_token);
        window.location.replace('/');
      } catch (e) {
        setError(e.message);
      }
    }
    exchangeCode();
  }, [code]);

  if (!code) {
    return (
      <>
        <p>Invalid callback.</p>
        <p><a href='/'>Return to home</a></p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <p>{ formatError(error) }</p>
        <p><a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Try again</a></p>
      </>
    );
  }

  return (
    <p>Logging in with Spotify...</p>
  );
}

export default SpotifyCallback;
