import React from 'react';
import { formatError } from '../tools/api';
import s from './LyricsView.module.css';

function LyricsView({ lyrics, error }) {
  if (lyrics === '' || (!lyrics && error)) {
    return (
      <p>{ formatError(error) }</p>
    );
  }

  if (!lyrics) {
    return <p>Loading...</p>;
  }

  return (
    <div className={s.root}>
      { lyrics.map((paragraph, p_index) => (
        <p key={p_index}>{ paragraph.map((line, l_index) => (
          <span key={l_index}>
            { line }
            <br />
          </span>
        )) }</p>
      )) }
    </div>
  );
}

export default LyricsView;
