import React from 'react';
import s from './Footer.module.css';

function Footer() {
  const onLogout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  const version = process.env.SPOTLY_VERSION ? `v${process.env.SPOTLY_VERSION}` : 'development version';

  return (
    <footer className={s.root}>
      <div>
        <p><b>Spotly</b> { version }</p>
        <p><a href="https://github.com/maximelouet/spotly" className="link">View this project on GitHub</a></p>
      </div>
      <div>
        <p><a href="https://github.com/maximelouet/spotly/issues" className="link">Report an issue</a></p>
        <p><button onClick={onLogout} className="link">Logout</button>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
