import React, { useId, useState } from 'react';
import { api } from '../../utils/api';
import type { StoreTheme } from '../../utils/themes';

interface NewsletterSignupProps {
  storeSlug: string;
  storeName: string;
  theme: StoreTheme;
  demo?: boolean;
  available?: boolean;
}

interface SubscribeResult {
  pending?: boolean;
  demo?: boolean;
}

export function NewsletterSignup({ storeSlug, storeName, theme, demo = false, available = false }: NewsletterSignupProps) {
  const emailId = useId();
  const consentId = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(null);

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setFeedback(null);
    if (!consent) {
      setFeedback({ text: 'Confirme que tu souhaites recevoir les e-mails de cette boutique.', error: true });
      return;
    }
    if (demo) {
      setFeedback({ text: 'Mode démo : aucune adresse enregistrée et aucun e-mail envoyé.', error: false });
      setEmail('');
      setConsent(false);
      return;
    }
    setPending(true);
    try {
      const result = await api<SubscribeResult>(`/stores/${encodeURIComponent(storeSlug)}/subscribers`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), consent: true })
      });
      setFeedback({
        text: result.demo ? 'Mode démo : aucune adresse enregistrée.' : 'Si cette adresse n’est pas déjà inscrite, un e-mail de confirmation va arriver.',
        error: false
      });
      setEmail('');
      setConsent(false);
    } catch (error) {
      setFeedback({
        text: error instanceof Error ? error.message : 'Inscription impossible. Réessaie.',
        error: true
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl p-4 md:p-5" style={{ backgroundColor: theme.accentSoft }}>
      <form onSubmit={subscribe}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold">Reste à jour</h2>
            <p className="mt-1 text-sm" style={{ color: theme.muted }}>Reçois les nouveautés et offres de {storeName}.</p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row md:w-[min(100%,460px)]">
            <label className="sr-only" htmlFor={emailId}>Ton adresse e-mail</label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              required
              disabled={!demo && !available}
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border px-4 text-sm outline-none focus-visible:ring-2"
              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
              placeholder="Ton adresse e-mail" />
            <button
              type="submit"
              disabled={pending || (!demo && !available)}
              className="h-11 shrink-0 rounded-lg px-5 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
              style={{ backgroundColor: theme.accent, color: theme.accentText }}>
              {pending ? 'Inscription...' : "S'abonner"}
            </button>
          </div>
        </div>
        <label htmlFor={consentId} className="mt-4 flex max-w-[720px] cursor-pointer items-start gap-2 text-xs leading-relaxed" style={{ color: theme.muted }}>
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-0.5 size-4 shrink-0"
            style={{ accentColor: theme.accent }} />
          <span>J'accepte de recevoir les nouveautés et offres de {storeName} par e-mail.</span>
        </label>
      </form>
      {demo && <p className="mt-3 text-xs" style={{ color: theme.muted }}>Mode démo : aucune adresse n'est enregistrée.</p>}
      {!demo && !available && <p className="mt-3 text-xs" style={{ color: theme.muted }}>Les inscriptions par e-mail sont momentanément indisponibles.</p>}
      {feedback &&
        <p role={feedback.error ? 'alert' : 'status'} className="mt-3 text-xs font-medium" style={{ color: feedback.error ? '#ef7777' : theme.accent }}>
          {feedback.text}
        </p>}
    </section>
  );
}
