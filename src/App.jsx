import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CareerScene from './components/CareerScene.jsx';
import CareerOverlay from './components/CareerOverlay.jsx';
import NavigationArrow from './components/NavigationArrow.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import WorldMapBackground from './components/WorldMapBackground.jsx';
import { careerStages } from './data/careerStages.js';
import { animateProgressIn } from './utils/animations.js';
import './App.css';

// A single wheel notch or swipe changes the stage. This cooldown blocks
// further triggers until the transition settles, so one continuous
// trackpad gesture (which fires dozens of wheel events) doesn't skip
// through several stages at once.
const TRANSITION_LOCK_MS = 700;
const SWIPE_THRESHOLD = 40;

function App() {
  const [stageIndex, setStageIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [activePanel, setActivePanel] = useState(null);

  const mainRef = useRef(null);
  const progressRef = useRef(null);
  const isCommittingRef = useRef(false);
  const lockTimerRef = useRef(null);
  const touchLastYRef = useRef(null);

  const totalStages = careerStages.length;
  const isLastStage = stageIndex === totalStages - 1;
  const isFirstStage = stageIndex === 0;
  const stage = careerStages[stageIndex];

  // Read via refs inside the wheel/touch effect below instead of closing
  // over these directly — they change on every stage transition, and
  // putting them in that effect's deps would re-run it (tearing down the
  // pending unlock timeout) right when a transition is in flight.
  const isFirstStageRef = useRef(isFirstStage);
  const isLastStageRef = useRef(isLastStage);
  isFirstStageRef.current = isFirstStage;
  isLastStageRef.current = isLastStage;

  const goNext = useCallback(() => {
    setDirection('next');
    setStageIndex((current) => Math.min(current + 1, totalStages - 1));
  }, [totalStages]);

  const goPrev = useCallback(() => {
    setDirection('prev');
    setStageIndex((current) => Math.max(current - 1, 0));
  }, []);

  const restartJourney = useCallback(() => {
    setDirection('prev');
    setStageIndex(0);
  }, []);

  useEffect(() => {
    animateProgressIn(progressRef.current);
  }, []);

  useEffect(() => {
    const node = mainRef.current;
    if (!node) return;

    function lock() {
      isCommittingRef.current = true;
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = setTimeout(() => {
        isCommittingRef.current = false;
      }, TRANSITION_LOCK_MS);
    }

    function triggerNext() {
      if (isLastStageRef.current) return;
      lock();
      goNext();
    }

    function triggerPrev() {
      if (isFirstStageRef.current) return;
      lock();
      goPrev();
    }

    function handleWheel(event) {
      if (activePanel) return;
      event.preventDefault();
      if (isCommittingRef.current || Math.abs(event.deltaY) < 2) return;
      if (event.deltaY > 0) triggerNext();
      else triggerPrev();
    }

    function handleTouchStart(event) {
      touchLastYRef.current = event.touches[0]?.clientY ?? null;
    }

    function handleTouchMove(event) {
      if (activePanel || isCommittingRef.current || touchLastYRef.current === null) return;
      const currentY = event.touches[0]?.clientY ?? touchLastYRef.current;
      const deltaY = touchLastYRef.current - currentY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      touchLastYRef.current = null;
      if (deltaY > 0) triggerNext();
      else triggerPrev();
    }

    function handleTouchEnd() {
      touchLastYRef.current = null;
    }

    function handleKeyDown(event) {
      if (activePanel || isCommittingRef.current) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        triggerNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        triggerPrev();
      }
    }

    node.addEventListener('wheel', handleWheel, { passive: false });
    node.addEventListener('touchstart', handleTouchStart, { passive: true });
    node.addEventListener('touchmove', handleTouchMove, { passive: true });
    node.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(lockTimerRef.current);
      node.removeEventListener('wheel', handleWheel);
      node.removeEventListener('touchstart', handleTouchStart);
      node.removeEventListener('touchmove', handleTouchMove);
      node.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePanel, goNext, goPrev]);

  const handleHeaderNav = (id) => {
    if (id === 'curriculum') {
      setActivePanel(null);
      return;
    }
    setActivePanel(id);
  };

  return (
    <div className="app-shell">
      <Header activePanel={activePanel} onNavigate={handleHeaderNav} />

      <main
        className="app-main"
        aria-label="Career journey"
        ref={mainRef}
      >
        <section
          className="journey-stage"
          aria-roledescription="career chapter"
          aria-label={`${stage.chapter}: ${stage.title}`}
        >
          <WorldMapBackground stages={careerStages} activeIndex={stageIndex} />
          <CareerScene stage={stage} direction={direction} />
          <CareerOverlay
            stage={stage}
            stageNumber={stageIndex + 1}
            totalStages={totalStages}
            direction={direction}
          />

          {stageIndex > 0 && (
            <NavigationArrow
              direction="prev"
              onClick={goPrev}
              label="Go to previous career stage"
            />
          )}

          <NavigationArrow
            direction="next"
            onClick={isLastStage ? restartJourney : goNext}
            isRestart={isLastStage}
            label={
              isLastStage
                ? 'Restart the career journey from the beginning'
                : 'Go to next career stage'
            }
          />

          <ol className="journey-progress" aria-label="Career journey progress" ref={progressRef}>
            {careerStages.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`journey-progress__dot${index === stageIndex ? ' is-active' : ''}`}
                  aria-label={`Go to ${item.title}`}
                  aria-current={index === stageIndex ? 'step' : undefined}
                  onClick={() => {
                    setDirection(index > stageIndex ? 'next' : 'prev');
                    setStageIndex(index);
                  }}
                />
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />

      {activePanel && (
        <InfoPanel type={activePanel} onClose={() => setActivePanel(null)} />
      )}
    </div>
  );
}

export default App;
