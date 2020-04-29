import React from 'react';
import cl from 'classnames';
import formatError from '../tools/formatError';
import s from './LyricsView.module.css';

function LyricsView({ lyrics, error }) {
  if (lyrics === '' || (!lyrics && error)) {
    return (
      <div className={s.minHeight}>
        { formatError(error) }
      </div>
    );
  }

  if (!lyrics) {
    return (
      <div className={s.minHeight}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={s.root}>
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
