import { useEffect, useRef } from 'react';
import { animateFooterIn } from '../utils/animations.js';
import './Footer.css';

function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    animateFooterIn(footerRef.current);
  }, []);

  return (
    <footer className="site-footer" ref={footerRef}>
      <p>&copy; {new Date().getFullYear()} Pedro Faria — Front End Developer</p>
    </footer>
  );
}

export default Footer;
