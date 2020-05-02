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

  if (lyrics.length === 1 && lyrics[0].length === 1 && lyrics[0][0] === 'Instrumental') {
    return (
      <div className={s.root}>
        <p className="light-bold">
          This song is instrumental.
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
              { (line.match(/^\[.*\]( x\d)?/)) ? (
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
