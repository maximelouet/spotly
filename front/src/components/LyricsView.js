import React from 'react';
import s from './LyricsView.module.css';

function LyricsView({ lyrics }) {
  const notFound = lyrics === '';

  if (notFound) {
    return <p>No lyrics found for this track.</p>;
  }

  if (!lyrics) {
    return null;
  }

  return (
    <div className={s.root}>
      { lyrics.map(paragraph => (
        <p>{ paragraph.map(line => (
          <>
            { line }
            <br />
          </>
        )) }</p>
      )) }
    </div>
  );
}

export default LyricsView;
