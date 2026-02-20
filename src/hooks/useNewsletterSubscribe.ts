import { useCallback, useState } from 'react';

const BUTTONDOWN_USERNAME = 'minamankarious';

export type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

export function useNewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<SubscribeState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (state === 'error') setState('idle');
    },
    [state]
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || state === 'loading') return;

      setState('loading');
      setErrorMsg('');

      try {
        const res = await fetch(
          `https://buttondown.com/api/emails/embed-subscribe/${BUTTONDOWN_USERNAME}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, tag: 'website' }),
          }
        );
        if (res.ok || res.status === 201) {
          setState('success');
        } else {
          setState('error');
          setErrorMsg('Something went wrong. Please try again.');
        }
      } catch {
        setState('error');
        setErrorMsg('Unable to connect. Please try again.');
      }
    },
    [email, state]
  );

  const reset = useCallback(() => {
    setEmail('');
    setState('idle');
    setErrorMsg('');
  }, []);

  return { email, state, errorMsg, handleEmailChange, submit, reset };
}
