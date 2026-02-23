import { useCallback, useState } from 'react';

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
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), tag: 'website' }),
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          setState('success');
        } else {
          setState('error');
          setErrorMsg(data?.error || 'Something went wrong. Please try again.');
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
