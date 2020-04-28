import React from 'react';
import { formatError } from '../tools/api';
import s from './LyricsView.module.css';

function LyricsView({ lyricsData, error }) {
  if (lyricsData?.lyrics === '' || (!lyricsData?.lyrics && error)) {
    return (
      <div className={s.minHeight}>
        { formatError(error) }
      </div>
    );
  }

  if (!lyricsData?.lyrics) {
    return (
      <div className={s.minHeight}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={s.root}>
      { lyricsData.lyrics.map((paragraph, p_index) => (
        <p key={p_index}>{ paragraph.map((line, l_index) => (
          <React.Fragment key={l_index}>
            { line }
            <br />
          </React.Fragment>
        )) }</p>
      )) }
      { lyricsData.source && (
        <p className={s.lyricsSource}>
          <span className="light-bold">
            Lyrics source
          </span>:{ ' ' }
          { lyricsData.source }
        </p>
      ) }
    </div>
  );
}

export default LyricsView;
