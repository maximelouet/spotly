import React, { useCallback, useEffect, useState } from 'react';
import LyricsView from './components/LyricsView';
import PlaybackStateView from './components/PlaybackStateView';
import Footer from './components/Footer';
import LoginWithSpotify from './components/LoginWithSpotify';
import SpotifyCallback from './components/SpotifyCallback';
import useInterval from './tools/useInterval';
import api from './tools/api';
import logout from './tools/logout';
import isConnectionError from './tools/isConnectionError';

function App() {
  const [playbackState, setPlaybackState] = useState(undefined);
  const [lyrics, setLyrics] = useState(undefined);
  const [lyricsUrl, setLyricsUrl] = useState(undefined);
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
        setLyricsUrl(undefined);
        setError(response.error);
        return;
      }
      if (isConnectionError(error) && response) {
        // refresh page after restoring connectivity
        // this is simpler for state management, but a lost API connection may also indicate an
        //   API upgrade so refreshing is a good idea in case the front should be upgraded as well
        window.location.reload(true);
        return;
      }
      if (error !== 'LYRICS_NOT_FOUND') {
        setError(response.error);
      }
      const finishesIn = ps?.song?.durationMs - ps?.song.progressMs;
      if (finishesIn < 10000 && ps.isPlaying) {
        setTimeout(refresh, finishesIn + 300);
      }
      if (ps.song.id !== playbackState?.song?.id || error === 'WAITING_FOR_FOCUS') {
        setPlaybackState(ps);
        setLyrics(undefined);
        setLyricsUrl(undefined);
        setError(undefined);
        const cached = sessionStorage.getItem(ps.song.id);
        if (cached) {
          const data = JSON.parse(cached);
          setLyrics(data.lyrics);
          setLyricsUrl(data.url);
          setError(data.error);
        } else if (!document.hidden) { // do not fetch lyrics if app is unfocused to save resources
          const lyricsResponse = await api.getPlaybackLyrics();
          const lyricsPs = lyricsResponse.playbackState;
          const responseError = lyricsResponse.error;
          const lyricsData = lyricsResponse.lyricsData ?? { lyrics: '', url: '' };
          setPlaybackState(lyricsPs);
          setLyrics(lyricsData.lyrics);
          setLyricsUrl(lyricsData.url);
          setError(responseError);
          if (!responseError || responseError === 'LYRICS_NOT_FOUND') {
            const toCache = {
              lyrics: lyricsData.lyrics,
              url: lyricsData.url,
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

  // workaround to get perfect height on mobile
  useEffect(() => {
    const viewportHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
    window.addEventListener('resize', () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }, []);

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
      <PlaybackStateView
        playbackState={playbackState}
        error={lyrics !== undefined && error}
      />
      <LyricsView
        lyrics={lyrics}
        lyricsUrl={lyricsUrl}
        playbackState={playbackState}
        error={error}
      />
      <Footer loggedIn={loggedIn} />
    </main>
  );
}

export default App;
