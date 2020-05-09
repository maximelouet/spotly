import React from 'react';
import logout from './logout';

const formatError = (originalError, additionalMessage = undefined) => {
  const error = (originalError?.message) ? originalError.message : originalError;
  const accessToken = localStorage.getItem('accessToken');
  const suggestLogout = Boolean(accessToken);
  switch (error) {
    case 'NOTHING_PLAYING':
      return (
        <p>
          <span className="light-bold">No song is currently playing.</span>
        </p>
      );
    case 'LYRICS_NOT_FOUND':
      return (
        <>
          <p>
            <span className="light-bold">No lyrics found for this track.</span>
          </p>
          { additionalMessage && (
            <p>
              <span className="light-italic">{ additionalMessage }</span>
            </p>
          ) }
        </>
      );
    case 'WAITING_FOR_FOCUS':
      return (
        <>
          <p>
            <span className="light-bold">Waiting for focus...</span>
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
          <p>
            <span className="light-bold">Error: unable to reach the server.</span>
            { error === 'NO_INTERNET' && (
              <>
                <br />
                <span>Your device is offline.</span>
              </>
            )}
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
