import React, { useEffect, useState } from 'react';
import './App.css';
import LyricsView from './components/LyricsView';
import PlaybackStateView from './components/PlaybackStateView';
import LoginWithSpotify from './components/LoginWithSpotify';
import SpotifyCallback from './components/SpotifyCallback';
import api from './tools/api';

function App() {
  const [playbackState, setPlaybackState] = useState(undefined);
  const [lyrics, setLyrics] = useState(undefined);
  const [error, setError] = useState(undefined);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    async function populate() {
      const ps = await api.getPlaybackLyrics();
      setPlaybackState(ps.playbackState);
      setLyrics(ps.lyrics);
      if (ps.error) {
        setError(ps.error);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  if (error) {
    let message;
    if (error === 'NOTHING_PLAYING') {
      message = 'Nothing is currently playing.';
    } else {
      message = 'An error occurred.';
    }
    return (
      <main>
        <p>{ message }</p>
      </main>
    )
  }

  return (
    <main>
      <PlaybackStateView playbackState={playbackState} />
      <LyricsView lyrics={lyrics} />
    </main>
  );
}

export default App;
