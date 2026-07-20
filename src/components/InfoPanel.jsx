import { useLayoutEffect, useRef, useState } from 'react';
import { animatePanelIn, animatePanelOut } from '../utils/animations.js';
import './InfoPanel.css';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqerbdpw';

function AboutContent() {
  return (
    <>
      <h3>More About Me</h3>
      <p>
        I&apos;m a Front End Developer who enjoys turning ambiguous problems into clean,
        usable interfaces. My path started in Mechatronics, moved through aerospace
        tooling, SaaS products, e-commerce, and now public-sector systems — each step
        adding a new layer of ownership, from writing the first line of code to leading
        front end decisions for a team.
      </p>
      <p>
        I care about accessibility, maintainable architecture, and building things that
        make sense for the business behind them. Outside of code, I like exploring how
        good design and good engineering reinforce each other.
      </p>
    </>
  );
}

function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.target),
      });
      if (response.ok) {
        setStatus('success');
        setFields({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="info-panel__form-status is-success" role="status">
        Thanks! Your message was sent — I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form className="info-panel__form" onSubmit={handleSubmit}>
      <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" className="visually-hidden" />
      <input type="hidden" name="_subject" value="New message from pedro-cv-journey" />

      <div className="info-panel__field">
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={fields.name}
          onChange={handleChange}
        />
      </div>

      <div className="info-panel__field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={fields.email}
          onChange={handleChange}
        />
      </div>

      <div className="info-panel__field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows="4"
          required
          value={fields.message}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="info-panel__submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {status === 'error' && (
        <p className="info-panel__form-status is-error" role="alert">
          Something went wrong — please try again or email me directly.
        </p>
      )}
    </form>
  );
}

function ContactContent() {
  return (
    <>
      <h3>Contact</h3>
      <dl className="info-panel__contact">
        <div>
          <dt>Name</dt>
          <dd>Pedro Faria</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>Front End Developer</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>Portugal</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href="mailto:pedro_faria01@hotmail.com">pedro_faria01@hotmail.com</a>
          </dd>
        </div>
        <div>
          <dt>LinkedIn</dt>
          <dd>
            <a href="https://www.linkedin.com/in/pedro-leonardo-faria/" target="_blank" rel="noreferrer">
              linkedin.com/in/pedro-leonardo-faria
            </a>
          </dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd>
            <a href="https://github.com/PedroFaria01" target="_blank" rel="noreferrer">
              github.com/PedroFaria01
            </a>
          </dd>
        </div>
      </dl>

      <p className="info-panel__form-intro">Or send a message directly:</p>
      <ContactForm />
    </>
  );
}

function InfoPanel({ type, onClose }) {
  const closeButtonRef = useRef(null);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    animatePanelOut(backdropRef.current, panelRef.current, onClose);
  };

  useLayoutEffect(() => {
    closeButtonRef.current?.focus();
    animatePanelIn(backdropRef.current, panelRef.current);

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        requestClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="info-panel-backdrop"
      role="presentation"
      onClick={requestClose}
      ref={backdropRef}
    >
      <div
        className="info-panel"
        role="dialog"
        aria-modal="true"
        aria-label={type === 'about' ? 'More about me' : 'Contact information'}
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
      >
        <button
          type="button"
          className="info-panel__close"
          onClick={requestClose}
          aria-label="Close panel"
          ref={closeButtonRef}
        >
          ×
        </button>
        {type === 'about' ? <AboutContent /> : <ContactContent />}
      </div>
    </div>
  );
}

export default InfoPanel;
