import { useEffect, useRef } from 'react';
import { animateHeaderIn } from '../utils/animations.js';
import logo from '../img/logo.png';
import logoWebp from '../img/logo.webp';
import './Header.css';

function Header({ activePanel, onNavigate }) {
  const headerRef = useRef(null);
  const navItems = [
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'about', label: 'More About Me' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    animateHeaderIn(headerRef.current);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__brand">
        <picture>
          <source srcSet={logoWebp} type="image/webp" />
          <img className="site-header__logo" src={logo} alt="" aria-hidden="true" width="34" height="34" />
        </picture>
        <span className="site-header__name">Pedro Faria</span>
      </div>
      <nav className="site-header__nav" aria-label="Primary navigation">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`site-header__link${activePanel === item.id ? ' is-active' : ''}`}
                aria-current={activePanel === item.id ? 'page' : undefined}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a
              className="site-header__cv"
              href={`${import.meta.env.BASE_URL}Pedro-Faria-CV.pdf`}
              download
            >
              <svg
                className="site-header__cv-icon"
                viewBox="0 0 16 16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 1.5v9m0 0L4.5 7M8 10.5 11.5 7M2 12.5v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1"
                />
              </svg>
              <span>Download CV</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
