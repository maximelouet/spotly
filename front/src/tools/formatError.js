import React from 'react';
import logout from './logout';

const formatError = (originalError, additionalMessage = undefined) => {
  const error = (originalError?.message) ? originalError.message : originalError;
  const accessToken = localStorage.getItem('accessToken');
  const suggestLogout = Boolean(accessToken);
  switch (error) {
    case 'NOTHING_PLAYING':
      return (
        <p className="light-bold">No song is currently playing.</p>
      );
    case 'LYRICS_NOT_FOUND':
      return (
        <>
          <p className="light-bold">No lyrics found for this track.</p>
          { additionalMessage && (
            <p className="light-italic">{ additionalMessage }</p>
          ) }
        </>
      );
    case 'WAITING_FOR_FOCUS':
      return (
        <>
          <p className="light-bold">Waiting for focus...</p>
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
    case 'OAUTH_EXCHANGE_ERROR':
      return (
        <>
          <p>
            <span className="light-bold">An error occurred:</span>
            <br />
            <code>Unable to retrieve an OAuth access token from Spotify.</code>
          </p>
          <p>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.reload(); }}
              className="link"
            >
              Try again
            </a>
            <span> or </span>
            <a
              href="/"
              className="link"
            >
              start over
            </a>
            .
          </p>
        </>
      );
    case 'NO_INTERNET':
    case 'Failed to fetch':
    case 'NetworkError when attempting to fetch resource.':
      return (
        <>
          <p className="light-bold">Error: unable to reach the server.</p>
          { error === 'NO_INTERNET' && (
            <p className="light-italic">Your device is offline.</p>
          ) }
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
              Reload page
            </a>
            { suggestLogout && (
              <>
                <span> or try </span>
                <a
                  href="/logout"
                  onClick={(e) => { e.preventDefault(); logout(); }}
                  className="link"
                >
                  logging out
                </a>
                <span> and logging back in.</span>
              </>
            ) }
          </p>
        </>
      );
  }
};

export default formatError;
