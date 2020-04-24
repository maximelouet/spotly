import React, { useEffect, useState } from 'react';
import api from '../tools/api';
import s from './SpotifyCallback.module.css';

function SpotifyCallback() {
  const [error, setError] = useState(false);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    async function exchangeCode() {
      const authData = await api.exchangeCode(code);
      if (!authData || !authData.access_token) {
        setError(true)
      } else {
        localStorage.setItem('accessToken', authData.access_token);
        window.location.replace('/');
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
        <p>An error occured.</p>
        <p><a href="/">Try again</a></p>
      </>
    )
  }

  return (
    <p>Logging in with Spotify...</p>
  );
}

export default SpotifyCallback;
