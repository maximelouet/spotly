import React from 'react';
import logout from '../tools/logout';
import s from './Footer.module.css';

function Footer() {
  const version = process.env.REACT_APP_VERSION ? `version ${process.env.REACT_APP_VERSION}` : 'development version';

  return (
    <footer className={s.root}>
      <div>
        <p>
          <span className="light-bold">Spotly</span>
          {' '}
          { version }
        </p>
        <p><a href="https://github.com/maximelouet/spotly" className="link">View this project on GitHub</a></p>
      </div>
      <div>
        <p><a href="https://github.com/maximelouet/spotly/issues" className="link">Report an issue</a></p>
        <p>
          <a href="/logout" onClick={(e) => { e.preventDefault(); logout(); }} className="link">Logout</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
