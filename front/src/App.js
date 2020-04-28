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
  const [error, setError] = useState(undefined);
  const [refreshInterval, setRefreshInterval] = useState(7000);

  const accessToken = localStorage.getItem('accessToken');

  const refresh = useCallback(async () => {
    if (!accessToken)
      return;
    try {
      const response = await api.getPlaybackState();
      const ps = response.playbackState;
      if (!ps?.item?.id) {
        setPlaybackState(ps);
        setLyrics(undefined);
        setError(response.error);
        return;
      }
      const finishesIn = ps?.item?.duration_ms - ps?.progress_ms;
      if (finishesIn < 7000) {
        setTimeout(refresh, finishesIn + 300);
      }
      if (ps.item.id !== playbackState?.item?.id) {
        setPlaybackState(ps);
        setLyrics(undefined);
        setError(undefined);
        const cached = sessionStorage.getItem(ps.item.id);
        if (cached) {
          const data = JSON.parse(cached);
          setLyrics(data.lyrics);
          setError(data.error);
        } else {
          const lyricsResponse = await api.getPlaybackLyrics();
          const ps = lyricsResponse.playbackState;
          const responseError = lyricsResponse.error;
          const lyricsData = lyricsResponse.lyricsData ?? { lyrics: '', source: undefined };
          setPlaybackState(ps);
          setLyrics(lyricsData.lyrics);
          setError(responseError);
          if (!responseError || responseError === 'LYRICS_NOT_FOUND') {
            const toCache = {
              lyrics: lyricsData.lyrics,
              error: responseError,
            };
            sessionStorage.setItem(ps.item.id, JSON.stringify(toCache));
          }
        }
      }
    } catch (e) {
      setError(e);
    }
  }, [accessToken, playbackState]);

  useInterval(() => {
    refresh();
  }, refreshInterval);

  useEffect(() => {
    const onFocusChange = () => {
      if (document.hidden) {
        setRefreshInterval(180000); // refresh every 3 min when unfocused to reduce useless requests
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
      <LyricsView lyrics={lyrics} error={error} />
      <Footer />
    </main>
  );
}

export default App;
