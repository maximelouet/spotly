import React from 'react';
import logout from './logout';

const formatError = (originalError) => {
  const error = (originalError?.message) ? originalError.message : originalError;
  switch (error) {
    case 'NOTHING_PLAYING':
      return (
        <p>
          <span className="light-bold">No song is currently playing.</span>
        </p>
      );
    case 'LYRICS_NOT_FOUND':
      return (
        <p>
          <span className="light-bold">No lyrics found for this track.</span>
        </p>
      );
    case 'WAITING_FOR_FOCUS':
      return (
        <>
          <p>
            <span className="light-bold">Waiting for tab focus to load lyrics...</span>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Reload page
            </a>
          </p>
        </>
      );
    // may happen only if Spotify revokes the user's token
    case 'Unauthorized':
      return (
        <>
          <p>
            <span className="light-bold">An error occured (401).</span>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Reload page
            </a>
            <span> or try </span>
            <a
              href="/logout"
              onClick={(e) => { e.preventDefault(); logout(); }}
              className="link"
            >
              logging out
            </a>
            <span> and logging back in.</span>
          </p>
        </>
      );
    default:
      return (
        <>
          <p>
            <span className="light-bold">An error occurred:</span>
            <br />
            <code>{ error }</code>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Try again
            </a>
          </p>
        </>
      );
  }
};

export default formatError;
