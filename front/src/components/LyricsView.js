import React from 'react';
import cl from 'classnames';
import formatError from '../tools/formatError';
import s from './LyricsView.module.css';

function LyricsView({
  lyrics, lyricsUrl, playbackState, error,
}) {
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
          { paragraph.map((line, lIndex) => {
            // use non-breaking spaces before some special characters
            const nbspString = line.replace(/ ([!?:])/g, '\u00a0$1');
            return (
              <React.Fragment key={lIndex}>
                {(line.match(/^\[.*]( x\d)?$/)) ? (
                  <span className={cl(s.geniusIndicator, 'light-bold')}>{ nbspString }</span>
                ) : nbspString }
                <br />
              </React.Fragment>
            );
          }) }
        </p>
      )) }
      { lyricsUrl && (
        <p className={s.geniusLink}>
          <a
            href={lyricsUrl}
            title="Open song Genius page in a new tab"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open on Genius
            { ' ' }
            <img src="/genius.png" alt="" />
          </a>
        </p>
      ) }
    </div>
  );
}

export default LyricsView;
