import React from 'react';
import cl from 'classnames';
import logout from '../tools/logout';
import s from './Footer.module.css';

function Footer({ loggedIn }) {
  const version = window._env_?.VERSION ? `version ${window._env_.VERSION}` : 'development version';

  const onToggleTheme = (e) => {
    e.preventDefault();
    clearTimeout(window.transitionTimeout);
    if (document.documentElement.classList.contains('dark-theme')) {
      document.documentElement.classList.add('transitioning');
      document.documentElement.classList.remove('dark-theme');
      window.transitionTimeout = setTimeout(() => document.documentElement.classList.remove('transitioning'), 200);
      localStorage.setItem('darkTheme', '0');
    } else {
      document.documentElement.classList.add('transitioning');
      document.documentElement.classList.add('dark-theme');
      window.transitionTimeout = setTimeout(() => document.documentElement.classList.remove('transitioning'), 200);
      localStorage.setItem('darkTheme', '1');
    }
  };

  return (
    <footer className={s.root}>
      <button
        className={s.themeToggler}
        type="button"
        onClick={onToggleTheme}
        title="Toggle dark mode"
        aria-label="Toggle dark mode"
      >
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M26.644 5.553c-1.33-2.746-4.29-5.587-9.643-5.552-5.355-.035-8.315 2.806-9.645 5.552C5.993 8.293 6.005 10.916 5.999 11c.045 5.542 4.243 9.623 4.292 9.707.824.817 1.266 1.896 1.488 2.785.111.443.167.834.194 1.108.027.272.023.399.027.399V30h2l2 2h2l2-2h2v-5.039c0-.04.002-.142.025-.361.074-.83.443-2.677 1.681-3.894.051-.084 4.249-4.165 4.292-9.707-.004-.083.008-2.706-1.354-5.446zm-2.498 11.298a16.07 16.07 0 01-1.293 1.808c-.351.424-.562.632-.562.634-1.558 1.593-2.047 3.548-2.206 4.708h-6.171c-.16-1.16-.649-3.115-2.208-4.708 0 0-.21-.21-.562-.634C10.078 17.388 7.982 14.339 8 11c0-.002-.002-.531.142-1.397.214-1.303.768-3.249 2.067-4.799C11.517 3.26 13.499 2.016 17.001 2c4.644.035 6.685 2.195 7.854 4.447.566 1.13.858 2.29 1 3.156.146.866.138 1.397.144 1.397.004 2.228-.908 4.321-1.853 5.851z" />
        </svg>
      </button>
      <div>
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
      </div>
    </footer>
  );
}

export default Footer;
