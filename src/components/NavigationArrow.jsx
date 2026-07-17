import { useEffect, useRef } from 'react';
import { animateArrowIn } from '../utils/animations.js';
import './NavigationArrow.css';

function NavigationArrow({ direction = 'next', onClick, label, isRestart = false }) {
  const arrowRef = useRef(null);

  useEffect(() => {
    animateArrowIn(arrowRef.current, direction === 'prev' ? 80 : 0);
  }, []);

  return (
    <button
      type="button"
      ref={arrowRef}
      className={`nav-arrow nav-arrow--${direction}${isRestart ? ' nav-arrow--restart' : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {isRestart ? (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 5V2L7 7l5 5V9c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 15c0-4.42-3.58-8-8-8zm-6 8c0-1.01.25-1.97.7-2.8L5.24 8.74A7.93 7.93 0 0 0 4 13c0 4.42 3.58 8 8 8v3l5-5-5-5v3c-3.31 0-6-2.69-6-6z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path
            fill="currentColor"
            d={direction === 'next' ? 'M9 6l8 6-8 6V6z' : 'M15 6L7 12l8 6V6z'}
          />
        </svg>
      )}
    </button>
  );
}

export default NavigationArrow;
