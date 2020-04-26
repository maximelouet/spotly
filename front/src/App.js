import React, { useCallback, useEffect, useState } from 'react';
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
  const [refreshInterval, setRefreshInterval] = useState(7000);

  const accessToken = localStorage.getItem('accessToken');

  const refresh = useCallback(async (force = false) => {
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
  }, [accessToken, playbackState, lyrics, error]);

  useInterval(() => {
    refresh();
  }, refreshInterval);

  useEffect(() => {
    const onFocusChange = () => {
      if (document.hidden) {
        setRefreshInterval(30000);
      } else {
        refresh();
        setRefreshInterval(7000);
      }
    };
    document.addEventListener('visibilitychange', onFocusChange);
    return () => document.removeEventListener('visibilitychange', onFocusChange);
  }, [accessToken, refresh]);

  useEffect(() => {
    if (accessToken)
      refresh();
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

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
