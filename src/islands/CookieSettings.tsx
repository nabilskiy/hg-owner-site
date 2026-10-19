import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { loadAnalytics } from '@/lib/consent';

interface Props {
  lang: string;
  title: string;
  description: string;
  acceptAll: string;
  reject: string;
  manage: string;
  save: string;
  necessary: string;
  analytics: string;
}

export default function CookieSettings(props: Props) {
  useEffect(() => {
    void CookieConsent.run({
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {},
      },
      language: {
        default: props.lang,
        translations: {
          [props.lang]: {
            consentModal: {
              title: props.title,
              description: props.description,
              acceptAllBtn: props.acceptAll,
              acceptNecessaryBtn: props.reject,
              showPreferencesBtn: props.manage,
            },
            preferencesModal: {
              title: props.manage,
              acceptAllBtn: props.acceptAll,
              acceptNecessaryBtn: props.reject,
              savePreferencesBtn: props.save,
              sections: [
                {
                  title: props.necessary,
                  description: props.description,
                  linkedCategory: 'necessary',
                },
                {
                  title: props.analytics,
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
      onConsent: () => {
        if (CookieConsent.acceptedCategory('analytics')) {
          loadAnalytics();
        }
      },
    });
  }, [props]);

  return null;
}
