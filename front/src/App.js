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
  const [refreshInterval, setRefreshInterval] = useState(10000);

  const accessToken = localStorage.getItem('accessToken');

  const loggedIn = Boolean(accessToken);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await api.getPlaybackState();
      const ps = response.playbackState;
      if (!ps?.song?.id) {
        setPlaybackState(ps);
        setLyrics(undefined);
        setError(response.error);
        return;
      }
      // reset error after a network failure
      if (error !== 'LYRICS_NOT_FOUND') {
        setError(undefined);
      }
      // eslint-disable-next-line camelcase
      const finishesIn = ps?.song?.durationMs - ps?.song.progressMs;
      if (finishesIn < 10000 && ps.isPlaying) {
        setTimeout(refresh, finishesIn + 300);
      }
      if (ps.song.id !== playbackState?.song?.id || error === 'WAITING_FOR_FOCUS') {
        setPlaybackState(ps);
        setLyrics(undefined);
        setError(undefined);
        const cached = sessionStorage.getItem(ps.song.id);
        if (cached) {
          const data = JSON.parse(cached);
          setLyrics(data.lyrics);
          setError(data.error);
        } else if (!document.hidden) { // do not fetch lyrics if app is unfocused to save resources
          const lyricsResponse = await api.getPlaybackLyrics();
          const lyricsPs = lyricsResponse.playbackState;
          const responseError = lyricsResponse.error;
          const lyricsData = lyricsResponse.lyricsData ?? { lyrics: '', source: undefined };
          setPlaybackState(lyricsPs);
          setLyrics(lyricsData.lyrics);
          setError(responseError);
          if (!responseError || responseError === 'LYRICS_NOT_FOUND') {
            const toCache = {
              lyrics: lyricsData.lyrics,
              error: responseError,
            };
            sessionStorage.setItem(lyricsPs.song.id, JSON.stringify(toCache));
          }
        } else {
          setError('WAITING_FOR_FOCUS');
        }
      }
    } catch (e) {
      setError(e);
    }
  }, [accessToken, error, playbackState]);

  useInterval(() => {
    refresh();
  }, refreshInterval);

  useEffect(() => {
    const onFocusChange = () => {
      if (document.hidden) {
        setRefreshInterval(180000); // refresh every 3 min when unfocused to save resources
      } else {
        refresh();
        setRefreshInterval(10000);
      }
    };
    document.addEventListener('visibilitychange', onFocusChange);
    return () => document.removeEventListener('visibilitychange', onFocusChange);
  }, [accessToken, refresh]);

  useEffect(() => {
    if (accessToken) refresh();
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (window.location.pathname === '/callback') {
    return (
      <main>
        <SpotifyCallback />
      </main>
    );
  }

  if (window.location.pathname === '/logout') {
    return logout();
  }

  if (window.location.pathname !== '/') {
    return (
      <main>
        <div className="top-padding" />
        <p className="light-bold">Page not found.</p>
        <Footer loggedIn={loggedIn} />
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main>
        <LoginWithSpotify />
        <Footer loggedIn={loggedIn} />
      </main>
    );
  }

  return (
    <main>
      <PlaybackStateView playbackState={playbackState} error={lyrics !== undefined && error} />
      <LyricsView lyrics={lyrics} playbackState={playbackState} error={error} />
      <Footer loggedIn={loggedIn} />
    </main>
  );
}

export default App;
