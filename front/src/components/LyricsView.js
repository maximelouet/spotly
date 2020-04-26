import React from 'react';
import { formatError } from '../tools/api';
import s from './LyricsView.module.css';

function LyricsView({ lyrics, error }) {
  if (lyrics === '' || (!lyrics && error)) {
    return formatError(error);
  }

  if (!lyrics) {
    return <p>Loading...</p>;
  }

  return (
    <div className={s.root}>
      { lyrics.map((paragraph, p_index) => (
        <p key={p_index}>{ paragraph.map((line, l_index) => (
          <React.Fragment key={l_index}>
            { line }
            <br />
          </React.Fragment>
        )) }</p>
      )) }
    </div>
  );
}

export default LyricsView;
