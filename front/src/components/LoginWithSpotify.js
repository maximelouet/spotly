import React, { useEffect, useState } from 'react';
import api from '../tools/api';
import formatError from '../tools/formatError';
import s from './LoginWithSpotify.module.css';

function LoginWithSpotify() {
  const [authorizeUrl, setAuthorizeUrl] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    async function retrieveAuthorizeUrl() {
      try {
        const url = await api.getAuthorizeUrl();
        if (!url) throw new Error();
        setAuthorizeUrl(url);
      } catch (e) {
        setError(e);
      }
    }
    retrieveAuthorizeUrl();
  }, []);

  if (error) {
    return (
      <div className={s.root}>
        { formatError(error) }
      </div>
    );
  }

  if (!authorizeUrl) {
    return (
      <div className={s.root}>
        <p>
          Loading...
          <img src="/spotify_white.png" alt="Spotify" className={s.imagePreload} />
        </p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <p className={s.buttonContainer}>
        <a href={authorizeUrl} className={s.button}>
          <img src="/spotify_white.png" alt="Spotify" />
          <span>Log in with Spotify</span>
        </a>
      </p>
    </div>
  );
}

export default LoginWithSpotify;
