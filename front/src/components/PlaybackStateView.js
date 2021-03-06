import React, { useEffect, useState } from 'react';
import cl from 'classnames';
import s from './PlaybackStateView.module.css';

function PlaybackStateView({ playbackState, error }) {
  const [song, setSong] = useState(undefined);
  const [offline, setOffline] = useState(false);
  const songId = playbackState?.song?.id;

  useEffect(() => {
    if (playbackState && playbackState.song) {
      setSong({
        name: playbackState.song.name,
        image: playbackState.song.image,
        mainArtist: playbackState.song.artists[0],
        otherArtists: playbackState.song.artists.slice(1).reduce((acc, cur) => [...acc, cur], []),
      });
    } else {
      setSong(undefined);
    }
  }, [playbackState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [songId]);

  useEffect(() => {
    setOffline(error && error !== 'NOTHING_PLAYING' && error !== 'LYRICS_NOT_FOUND');
  }, [error]);

  useEffect(() => {
    document.title = offline ? 'Spotly (offline)' : 'Spotly';
  }, [offline]);

  return (
    <div className={cl(s.root, offline && s.faded)} title={offline ? 'Unable to refresh data' : undefined}>
      { song && (
        <>
          <img src={song.image} alt="Cover art" />
          <p className={s.songInfo}>
            <span>{ song.name }</span>
            <span>
              { song.mainArtist }
              { song.otherArtists.length > 0 && ', '}
              { song.otherArtists.join(', ') }
            </span>
          </p>
          { offline && (
            <span className={s.offlineIndicator}>
              Offline
            </span>
          ) }
        </>
      )}
    </div>
  );
}

export default PlaybackStateView;
