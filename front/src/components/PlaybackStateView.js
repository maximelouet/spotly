import React, { useEffect, useState } from 'react';
import s from './PlaybackStateView.module.css';

function PlaybackStateView({ playbackState, error }) {
  const [song, setSong] = useState(undefined);
  const songId = playbackState?.item.id;

  useEffect(() => {
    if (playbackState) {
      const otherArtists = [];
      playbackState.item.artists.slice(1).forEach((e) => otherArtists.push(e.name));
      setSong({
        name: playbackState.item.name,
        image: playbackState.item.album.images.find(e => e.height === 64).url,
        mainArtist: playbackState.item.artists[0].name,
        otherArtists,
      });
    } else {
      setSong(undefined);
    }
  }, [playbackState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [songId]);

  if (!song) {
    return null;
  }

  return (
    <div className={s.root}>
      <img src={song.image} alt="Cover art" />
      <p className={s.songInfo}>
        <span>{ song.name }</span>
        <span>
          <span className={s.mainArtist}>{ song.mainArtist }</span>
          { song.otherArtists.length > 0 && ', '}
          { song.otherArtists.join(', ') }
        </span>
      </p>
    </div>
  );
}

export default PlaybackStateView;
