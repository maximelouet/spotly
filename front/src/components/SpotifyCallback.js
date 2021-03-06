import React, { useEffect, useState } from 'react';
import api from '../tools/api';
import formatError from '../tools/formatError';
import getExpirationTimestamp from '../tools/getExpirationTimestamp';
import s from './SpotifyCallback.module.css';

function SpotifyCallback() {
  const [error, setError] = useState(undefined);

  const code = new URLSearchParams(window.location.search).get('code');

  useEffect(() => {
    async function exchangeCode() {
      try {
        const authData = await api.exchangeCode(code);
        if (!authData.access_token || !authData.refresh_token || !authData.expires_in) {
          throw new Error('OAUTH_EXCHANGE_ERROR');
        }
        localStorage.setItem('accessToken', authData.access_token);
        localStorage.setItem('refreshToken', authData.refresh_token);
        localStorage.setItem('expiresAt', getExpirationTimestamp(authData.expires_in));
        window.location.replace('/');
      } catch (e) {
        setError(e);
      }
    }
    exchangeCode();
  }, [code]);

  if (!code) {
    return (
      <div className={s.root}>
        <p>Invalid callback.</p>
        <p><a href="/" className="link">Return to home</a></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.root}>
        { formatError(error) }
      </div>
    );
  }

  return (
    <div className={s.root}>
      <p className="light-bold">Connecting to Spotify...</p>
    </div>
  );
}

export default SpotifyCallback;
