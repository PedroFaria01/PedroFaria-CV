import { useEffect, useRef } from 'react';
import { animateHeaderIn } from '../utils/animations.js';
import logo from '../img/logo.png';
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
        <img className="site-header__logo" src={logo} alt="" aria-hidden="true" />
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
        </ul>
      </nav>
    </header>
  );
}

export default Header;
