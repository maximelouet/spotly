import React, { useEffect, useState } from 'react';
import api from '../tools/api';
import s from './LoginWithSpotify.module.css';

function LoginWithSpotify() {
  const [authorizeUrl, setAuthorizeUrl] = useState(undefined);

  useEffect(() => {
    async function retrieveAuthorizeUrl() {
      const url = await api.getAuthorizeUrl();
      setAuthorizeUrl(url);
    }
    retrieveAuthorizeUrl();
  }, []);

  // FIXME: preload spotify logo image
  if (!authorizeUrl) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <a href={authorizeUrl} className={s.root}>
      <img src="/spotify_white.png" alt="Spotify" />
      <span>Login with Spotify</span>
    </a>
  );
}

export default LoginWithSpotify;
