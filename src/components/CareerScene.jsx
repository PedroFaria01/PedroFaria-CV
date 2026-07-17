import { useEffect, useRef } from 'react';
import { animateSceneIn } from '../utils/animations.js';
import './CareerScene.css';

function JourneyScene() {
  return (
    <>
      <div className="route-path" aria-hidden="true">
        <svg viewBox="0 0 400 200" preserveAspectRatio="none">
          <path
            d="M20,170 C120,40 200,180 380,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
        </svg>
        <span className="route-dot route-dot--start">BR</span>
        <span className="route-dot route-dot--end">PT</span>
      </div>
      <div className="stars" aria-hidden="true" />
    </>
  );
}

function HubScene() {
  return (
    <>
      <div className="hub-center" aria-hidden="true">PF</div>
      <div className="hub-orbit hub-orbit--1" aria-hidden="true">
        <span>React</span>
      </div>
      <div className="hub-orbit hub-orbit--2" aria-hidden="true">
        <span>UX/UI</span>
      </div>
      <div className="hub-orbit hub-orbit--3" aria-hidden="true">
        <span>APIs</span>
      </div>
      <div className="hub-orbit hub-orbit--4" aria-hidden="true">
        <span>A11y</span>
      </div>
    </>
  );
}

const SCENES = {
  journey: JourneyScene,
  hub: HubScene,
};

function CareerScene({ stage, direction }) {
  const SceneComponent = SCENES[stage.visualTheme] || null;
  const sceneRef = useRef(null);

  useEffect(() => {
    animateSceneIn(sceneRef.current, direction);
  }, [stage.id, direction]);

  return (
    <div
      key={stage.id}
      ref={sceneRef}
      className={`career-scene career-scene--${stage.visualTheme}`}
    >
      <div className="career-scene__particles" aria-hidden="true" />
      {SceneComponent && <SceneComponent />}
    </div>
  );
}

export default CareerScene;
