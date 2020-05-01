import React from 'react';
import cl from 'classnames';
import formatError from '../tools/formatError';
import s from './LyricsView.module.css';

function LyricsView({ lyrics, playbackState, error }) {
  if (lyrics === '' || (!lyrics && error)) {
    return (
      <div className={s.root}>
        { formatError(error) }
      </div>
    );
  }

  if (!lyrics) {
    return (
      <div className={s.root}>
        <p className="light-bold">
          Loading
          { playbackState && ' lyrics'}
          ...
        </p>
      </div>
    );
  }

  return (
    <div className={cl(s.root, s.lyrics)}>
      { lyrics.map((paragraph, pIndex) => (
        <p key={pIndex}>
          { paragraph.map((line, lIndex) => (
            <React.Fragment key={lIndex}>
              { (line.startsWith('[') && line.endsWith(']')) ? (
                <span className={cl(s.geniusIndicator, 'light-bold')}>{ line }</span>
              ) : line }
              <br />
            </React.Fragment>
          )) }
        </p>
      )) }
    </div>
  );
}

export default LyricsView;
