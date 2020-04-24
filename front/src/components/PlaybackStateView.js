import React, { useEffect } from 'react';
import s from './PlaybackStateView.module.css';

function PlaybackStateView({ playbackState }) {
  const ps = playbackState;
  const song = {
    name: ps?.item.name,
    artist: ps?.item.artists[0].name,
    image: ps?.item.album.images.find(e => e.height === 64).url,
  };
  const songId = ps?.item.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [songId]);

  if (!ps) {
    return <p>Loading...</p>;
  }

  return (
    <div className={s.root}>
      <img src={song.image} alt="Cover art" />
      <p className={s.songInfo}>
        <span>{ song.name }</span>
        <span>{ song.artist }</span>
      </p>
    </div>
  );
}

export default PlaybackStateView;
