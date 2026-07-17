import { animate, stagger, splitText, cubicBezier } from 'animejs';

const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

export function animateSceneIn(el, direction = 'next') {
  if (!el) return;
  const fromX = direction === 'next' ? 48 : -48;
  animate(el, {
    opacity: [0, 1],
    translateX: [fromX, 0],
    scale: [1.04, 1],
    duration: 650,
    ease: EASE_OUT,
  });
}

export function animateOverlayIn(el) {
  if (!el) return () => {};

  const splitters = [];

  animate(el, {
    opacity: [0, 1],
    translateY: [28, 0],
    duration: 550,
    ease: EASE_OUT,
  });

  const chapterEl = el.querySelector('.career-overlay__chapter');
  if (chapterEl) {
    animate(chapterEl, {
      opacity: [0, 1],
      translateX: [-18, 0],
      duration: 420,
      delay: 120,
      ease: EASE_OUT,
    });
  }

  const titleEl = el.querySelector('.career-overlay__title');
  if (titleEl) {
    const splitter = splitText(titleEl, { chars: true });
    splitters.push(splitter);
    animate(splitter.chars, {
      opacity: [0, 1],
      translateY: [(_, i) => (i % 2 ? 26 : -26), 0],
      rotateZ: [stagger([-8, 8]), 0],
      delay: stagger(20, { start: 220 }),
      duration: 600,
      ease: EASE_OUT,
    });
  }

  const roleEl = el.querySelector('.career-overlay__role');
  if (roleEl) {
    animate(roleEl, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 420,
      delay: 380,
      ease: EASE_OUT,
    });
  }

  const descEl = el.querySelector('.career-overlay__description');
  if (descEl) {
    const splitter = splitText(descEl, { words: true });
    splitters.push(splitter);
    animate(splitter.words, {
      opacity: [0, 1],
      translateY: [10, 0],
      filter: ['blur(6px)', 'blur(0px)'],
      delay: stagger(12, { start: 450 }),
      duration: 420,
      ease: EASE_OUT,
    });
  }

  const items = el.querySelectorAll(
    '.career-overlay__highlights li, .career-overlay__tech li'
  );
  if (items.length) {
    animate(items, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(45, { start: 600 }),
      duration: 450,
      ease: EASE_OUT,
    });
  }

  return () => splitters.forEach((splitter) => splitter.revert());
}

export function animateHeaderIn(el) {
  if (!el) return;
  animate(el, {
    opacity: [0, 1],
    translateY: [-24, 0],
    duration: 600,
    ease: EASE_OUT,
  });
}

export function animateFooterIn(el) {
  if (!el) return;
  animate(el, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 600,
    delay: 150,
    ease: EASE_OUT,
  });
}

export function animateArrowIn(el, delay = 0) {
  if (!el) return;
  animate(el, {
    opacity: [0, 1],
    duration: 450,
    delay: 300 + delay,
    ease: 'outElastic(1, 0.6)',
  });
}

export function animateProgressIn(el) {
  if (!el) return;
  animate(el, {
    opacity: [0, 1],
    duration: 500,
    delay: 400,
    ease: EASE_OUT,
  });
}

export function animatePanelIn(backdropEl, panelEl) {
  if (!backdropEl || !panelEl) return;
  animate(backdropEl, { opacity: [0, 1], duration: 250, ease: 'linear' });
  animate(panelEl, {
    opacity: [0, 1],
    translateY: [24, 0],
    scale: [0.96, 1],
    duration: 380,
    ease: EASE_OUT,
  });

  const content = panelEl.querySelectorAll('h3, p, dl > div');
  if (content.length) {
    animate(content, {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(60, { start: 180 }),
      duration: 380,
      ease: EASE_OUT,
    });
  }
}

export function animatePanelOut(backdropEl, panelEl, onComplete) {
  if (!backdropEl || !panelEl) {
    onComplete?.();
    return;
  }
  animate(panelEl, {
    opacity: [1, 0],
    translateY: [0, 16],
    scale: [1, 0.97],
    duration: 220,
    ease: 'inQuad',
  });
  animate(backdropEl, {
    opacity: [1, 0],
    duration: 240,
    ease: 'linear',
  }).then(() => onComplete?.());
}
