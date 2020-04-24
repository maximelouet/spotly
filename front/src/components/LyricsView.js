import React from 'react';
import { getErrorMessage } from '../tools/api';
import s from './LyricsView.module.css';

function LyricsView({ lyrics, errorMessage }) {
  if (lyrics === '') {
    return (
      <p>{ getErrorMessage(errorMessage) }</p>
    );
  }

  if (!lyrics) {
    return null;
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
