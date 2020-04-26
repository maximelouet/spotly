import React, { useEffect, useState } from 'react';
import LyricsView from './components/LyricsView';
import PlaybackStateView from './components/PlaybackStateView';
import LoginWithSpotify from './components/LoginWithSpotify';
import SpotifyCallback from './components/SpotifyCallback';
import useInterval from './tools/useInterval';
import api from './tools/api';

function App() {
  const [playbackState, setPlaybackState] = useState(undefined);
  const [lyrics, setLyrics] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const accessToken = localStorage.getItem('accessToken');

  const refresh = async (force = false) => {
    if (!accessToken)
      return;
    try {
      if (!playbackState || (!lyrics && error !== 'LYRICS_NOT_FOUND') || force) {
        const ps = await api.getPlaybackLyrics();
        setPlaybackState(ps.playbackState);
        setLyrics(ps.lyrics);
        setError(ps.error);
      } else {
        const response = await api.getPlaybackState();
        const ps = response.playbackState;
        if (ps.item?.id !== playbackState?.item?.id) {
          setPlaybackState(ps);
          setLyrics(undefined);
          setError(undefined);
          return refresh(true);
        }
      }
    } catch (e) {
      setError(e);
    }
  };

  useInterval(async () => {
    refresh();
  }, refreshInterval);

  useEffect(() => {
    if (accessToken)
      refresh();
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

  return (
    <main>
      <PlaybackStateView playbackState={playbackState} error={error} />
      <LyricsView lyrics={lyrics} error={error} />
    </main>
  );
}

export default App;
