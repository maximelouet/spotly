import React, { useEffect, useState } from 'react';
import api, { formatError } from '../tools/api';
import s from './LoginWithSpotify.module.css';

function LoginWithSpotify() {
  const [authorizeUrl, setAuthorizeUrl] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    async function retrieveAuthorizeUrl() {
      try {
        const url = await api.getAuthorizeUrl();
        if (!url)
          throw new Error();
        setAuthorizeUrl(url);
      } catch (e) {
        setError(e.message);
      }
    }
    retrieveAuthorizeUrl();
  }, []);

  if (error) {
    return formatError(error);
  }

  // FIXME: preload spotify logo image
  if (!authorizeUrl) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <a href={authorizeUrl} className={s.root}>
      <img src="/spotify_white.png" alt="Spotify" />
      <span>Log in with Spotify</span>
    </a>
  );
}

export default LoginWithSpotify;
