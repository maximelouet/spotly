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

  if (!authorizeUrl) {
    return (
      <p>Loading...<img src="/spotify_white.png" alt="Spotify" /></p>
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
