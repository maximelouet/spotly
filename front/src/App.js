import React, { useEffect, useState } from 'react';
import LyricsView from './components/LyricsView';
import PlaybackStateView from './components/PlaybackStateView';
import LoginWithSpotify from './components/LoginWithSpotify';
import SpotifyCallback from './components/SpotifyCallback';
import api, { getHtmlErrorMessage } from './tools/api';

function App() {
  const [playbackState, setPlaybackState] = useState(undefined);
  const [lyrics, setLyrics] = useState(undefined);
  const [error, setError] = useState(undefined);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    async function populate() {
      try {
        const ps = await api.getPlaybackLyrics();
        setPlaybackState(ps.playbackState);
        setLyrics(ps.lyrics);
        if (ps.error) {
          setError(ps.error);
        }
      } catch (e) {
        setError(e.message);
      }
    }
    if (accessToken) {
      populate();
      const refreshInterval = setInterval(populate, 10000);
      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [accessToken]);

  if (window.location.pathname === '/callback') {
    return (
      <main>
        <SpotifyCallback />
      </main>
    )
  }

  if (!accessToken) {
    return (
      <main>
        <LoginWithSpotify />
      </main>
    )
  }

  if (error && !playbackState && !lyrics) {
    return (
      <main>
        <p>{ getHtmlErrorMessage(error) }</p>
      </main>
    )
  }

  return (
    <main>
      <PlaybackStateView playbackState={playbackState} />
      <LyricsView lyrics={lyrics} errorMessage={error} />
    </main>
  );
}

export default App;
