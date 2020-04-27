import React, { useCallback, useEffect, useState } from 'react';
import LyricsView from './components/LyricsView';
import PlaybackStateView from './components/PlaybackStateView';
import Footer from './components/Footer';
import LoginWithSpotify from './components/LoginWithSpotify';
import SpotifyCallback from './components/SpotifyCallback';
import useInterval from './tools/useInterval';
import api from './tools/api';
import logout from './tools/logout';

function App() {
  const [playbackState, setPlaybackState] = useState(undefined);
  const [lyrics, setLyrics] = useState(undefined);
  const [lyricsSource, setLyricsSource] = useState(undefined);
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
        setLyricsSource(ps.source);
        setError(ps.error);
        const finishesIn = ps.playbackState?.item?.duration_ms - ps.playbackState?.progress_ms;
        if (finishesIn < 7000) {
          setTimeout(refresh, finishesIn + 300);
        }
      } else {
        const response = await api.getPlaybackState();
        const ps = response.playbackState;
        const finishesIn = ps?.item?.duration_ms - ps?.progress_ms;
        if (finishesIn < 7000) {
          setTimeout(refresh, finishesIn + 300);
        }
        if (ps?.item?.id !== playbackState?.item?.id) {
          setPlaybackState(ps);
          setLyrics(undefined);
          setLyricsSource(undefined);
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

  if (window.location.pathname === '/logout') {
    return logout();
  }

  if (window.location.pathname !== '/') {
    return (
      <main>
        <div className="top-padding" />
        <p>Page not found</p>
      </main>
    );
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
      <LyricsView lyrics={lyrics} lyricsSource={lyricsSource} error={error} />
      <Footer />
    </main>
  );
}

export default App;
