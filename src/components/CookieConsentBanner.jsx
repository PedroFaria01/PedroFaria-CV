import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import './CookieConsentBanner.css';

function updateGoogleConsent() {
  if (typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: CookieConsent.acceptedCategory('analytics') ? 'granted' : 'denied',
  });
}

function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: { layout: 'box', position: 'bottom left', equalWeightButtons: false },
        preferencesModal: { layout: 'box', equalWeightButtons: true },
      },
      categories: {
        necessary: { readOnly: true },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: '_gid' }],
          },
        },
      },
      onFirstConsent: updateGoogleConsent,
      onConsent: updateGoogleConsent,
      onChange: updateGoogleConsent,
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookies on this site',
              description:
                'I use a small amount of analytics (Google Analytics) to understand how visitors use this CV. No data is used for ads.',
              acceptAllBtn: 'Accept',
              acceptNecessaryBtn: 'Reject',
              showPreferencesBtn: 'Preferences',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Strictly necessary',
                  description: 'Required for the site to remember your cookie preference.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics',
                  description: 'Google Analytics — anonymized usage stats to see which chapters get read.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}

export default CookieConsentBanner;
