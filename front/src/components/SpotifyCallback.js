import React, { useEffect, useState } from 'react';
import api, { formatError } from '../tools/api';
import tokenHelper from '../tools/tokenHelper';
import s from './SpotifyCallback.module.css';

function SpotifyCallback() {
  const [error, setError] = useState(undefined);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    async function exchangeCode() {
      try {
        const authData = await api.exchangeCode(code);
        if (!authData.access_token || !authData.refresh_token || !authData.expires_in) {
          throw new Error('Unable to retrieve an OAuth access token.');
        }
        localStorage.setItem('accessToken', authData.access_token);
        localStorage.setItem('refreshToken', authData.refresh_token);
        localStorage.setItem('expiresAt', tokenHelper.getExpirationTimestamp(authData.expires_in));
        window.location.replace('/');
      } catch (e) {
        setError(e);
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
    return formatError(error);
  }

  return (
    <p>Connecting to Spotify...</p>
  );
}

export default SpotifyCallback;
