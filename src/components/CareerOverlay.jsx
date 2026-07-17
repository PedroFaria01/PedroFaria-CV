import { useLayoutEffect, useRef } from 'react';
import { animateOverlayIn } from '../utils/animations.js';
import './CareerOverlay.css';

function CareerOverlay({ stage, stageNumber, totalStages, direction }) {
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    return animateOverlayIn(overlayRef.current);
  }, [stage.id, direction]);

  return (
    <div key={stage.id} ref={overlayRef} className="career-overlay">
      <span className="career-overlay__chapter">
        {stage.chapter} <span aria-hidden="true">·</span> {stageNumber} / {totalStages}
      </span>
      <h2 className="career-overlay__title">{stage.title}</h2>
      {(stage.company || stage.role) && (
        <p className="career-overlay__role">
          {stage.role}
          {stage.company ? ` — ${stage.company}` : ''}
        </p>
      )}
      <p className="career-overlay__description">{stage.description}</p>

      {stage.highlights.length > 0 && (
        <ul className="career-overlay__highlights">
          {stage.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {stage.technologies.length > 0 && (
        <ul className="career-overlay__tech" aria-label="Technologies used">
          {stage.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CareerOverlay;
