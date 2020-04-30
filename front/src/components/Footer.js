import React from 'react';
import cl from 'classnames';
import logout from '../tools/logout';
import s from './Footer.module.css';

function Footer({ loggedIn }) {
  const version = process.env.REACT_APP_VERSION ? `version ${process.env.REACT_APP_VERSION}` : 'development version';

  return (
    <footer className={s.root}>
      <div>
        <p>
          <span className={s.projectName}>Spotly</span>
          {' '}
          { version }
        </p>
        <p><a href="https://github.com/maximelouet/spotly" className="link">View this project on GitHub</a></p>
      </div>
      <div>
        <p className={cl(s.logout, !loggedIn && s.hiddenLogout)}>
          <a
            href="/logout"
            onClick={(e) => { e.preventDefault(); logout(); }}
            className="link"
          >
            Logout
          </a>
        </p>
        <p><a href="https://github.com/maximelouet/spotly/issues" className="link">Report an issue</a></p>
      </div>
    </footer>
  );
}

export default Footer;
