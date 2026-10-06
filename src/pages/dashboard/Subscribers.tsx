import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Download, Mail, RefreshCw, Search, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSellia } from '../../contexts/SelliaContext';
import { api } from '../../utils/api';
import { formatDateTime } from '../../utils/format';

interface Subscriber {
  id: string;
  email: string;
  unsubscribeToken: string;
  createdAt: string;
  confirmedAt: string | null;
}

interface Campaign {
  id: string;
  subject: string;
  status: 'sending' | 'sent' | 'partial' | 'failed' | 'interrupted';
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  skippedCount: number;
  createdAt: string;
}

function csvCell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function Subscribers() {
  const { store, user, bootstrapStatus } = useSellia();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [testing, setTesting] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const loadedStoreRef = useRef('');

  useEffect(() => {
    if (bootstrapStatus !== 'ready' || !store.slug) return;
    const controller = new AbortController();
    if (loadedStoreRef.current !== store.slug) {
      setSubscribers([]);
      setCampaigns([]);
      setLoading(true);
    }
    setError('');
    Promise.all([
      api<Subscriber[]>(`/stores/${encodeURIComponent(store.slug)}/subscribers`, { signal: controller.signal }),
      api<Campaign[]>(`/stores/${encodeURIComponent(store.slug)}/newsletter/campaigns`, { signal: controller.signal })
    ])
      .then(([nextSubscribers, nextCampaigns]) => {
        loadedStoreRef.current = store.slug;
        setSubscribers(nextSubscribers);
        setCampaigns(nextCampaigns);
      })
      .catch((cause) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'Impossible de charger les abonnés.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [bootstrapStatus, reloadKey, store.slug]);

  useEffect(() => {
    if (!campaigns.some((campaign) => campaign.status === 'sending')) return;
    const timer = window.setInterval(() => setReloadKey((current) => current + 1), 3000);
    return () => window.clearInterval(timer);
  }, [campaigns]);

  const filtered = useMemo(
    () => subscribers.filter((subscriber) => subscriber.email.includes(query.trim().toLowerCase())),
    [query, subscribers]
  );
  const confirmedCount = subscribers.filter((subscriber) => subscriber.confirmedAt).length;
  const exportable = filtered.filter((subscriber) => subscriber.confirmedAt);
  const campaignValid = subject.trim().length >= 3 && body.trim().length >= 10;
  const campaignBusy = campaigns.some((campaign) => campaign.status === 'sending');

  async function sendTest() {
    if (!campaignValid || testing) return;
    setTesting(true);
    try {
      const result = await api<{ email: string }>(`/stores/${encodeURIComponent(store.slug)}/newsletter/test`, {
        method: 'POST',
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() })
      });
      toast.success(`E-mail de test envoyé à ${result.email}.`);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Envoi du test impossible.');
    } finally {
      setTesting(false);
    }
  }

  async function sendCampaign() {
    if (!campaignValid || !confirmSend || sending) return;
    setSending(true);
    try {
      await api(`/stores/${encodeURIComponent(store.slug)}/newsletter/campaigns`, {
        method: 'POST',
        body: JSON.stringify({ subject: subject.trim(), body: body.trim(), confirm: true })
      });
      toast.success('Envoi de la campagne démarré.');
      setConfirmSend(false);
      setSubject('');
      setBody('');
      setReloadKey((current) => current + 1);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Envoi impossible.');
    } finally {
      setSending(false);
    }
  }

  async function removeSubscriber(id: string) {
    setBusyId(id);
    try {
      await api(`/stores/${encodeURIComponent(store.slug)}/subscribers/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setSubscribers((current) => current.filter((item) => item.id !== id));
      setRemovingId(null);
      toast.success('Adresse retirée de la liste.');
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Suppression impossible.');
    } finally {
      setBusyId(null);
    }
  }

  async function copyUnsubscribeLink(token: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/desabonnement/${token}`);
      toast.success('Lien de désabonnement copié.');
    } catch {
      toast.error('Impossible de copier ce lien.');
    }
  }

  function exportCsv() {
    const rows = [
      ['Adresse e-mail', 'Date confirmation'],
      ...exportable.map((subscriber) => [subscriber.email, formatDateTime(subscriber.confirmedAt || subscriber.createdAt)])
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `abonnes-${store.slug}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="mx-auto w-full max-w-[860px] space-y-4 pb-24 lg:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="ds-title text-[22px] lg:text-[26px]">Abonnés e-mail</h2>
          <p className="mt-1 text-sm ds-muted">
            {confirmedCount} abonné{confirmedCount > 1 ? 's' : ''} confirmé{confirmedCount > 1 ? 's' : ''} à {store.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            disabled={loading}
            className="ds-btn ds-btn--outline ds-btn--sm">
            <RefreshCw className="size-4" /> Actualiser
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={exportable.length === 0}
            className="ds-btn ds-btn--outline ds-btn--sm">
            <Download className="size-4" /> Exporter CSV
          </button>
        </div>
      </div>

      <div className="relative max-w-[360px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 ds-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une adresse"
          aria-label="Rechercher un abonné"
          className="ds-input !pl-10" />
      </div>

      {store.plan !== 'premium' &&
        <p className="ds-card p-4 text-sm ds-muted">
          Les nouvelles inscriptions sont disponibles pour les boutiques Premium.
        </p>}

      <section className="ds-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="ds-title text-[16px]">Créer une campagne</h3>
            <p className="mt-1 text-sm ds-muted">Les adresses en attente de confirmation ne recevront rien.</p>
          </div>
          <span className="text-sm font-medium ds-muted">{confirmedCount} destinataire{confirmedCount > 1 ? 's' : ''}</span>
        </div>
        {!store.newsletterAvailable &&
          <p role="status" className="mt-4 border-l-2 border-amber-500 pl-3 text-sm ds-muted">
            L'envoi d'e-mails n'est pas configuré pour cette boutique.
          </p>}
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="campaign-subject" className="ds-label">Objet</label>
            <input
              id="campaign-subject"
              value={subject}
              onChange={(event) => { setSubject(event.target.value); setConfirmSend(false); }}
              maxLength={180}
              disabled={!store.newsletterAvailable}
              placeholder="Les nouveautés de la semaine"
              className="ds-input disabled:opacity-50" />
          </div>
          <div>
            <label htmlFor="campaign-body" className="ds-label">Message</label>
            <textarea
              id="campaign-body"
              value={body}
              onChange={(event) => { setBody(event.target.value); setConfirmSend(false); }}
              maxLength={5000}
              rows={6}
              disabled={!store.newsletterAvailable}
              placeholder="Présente tes nouveaux produits et tes offres..."
              className="ds-input ds-textarea disabled:opacity-50" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={sendTest}
              disabled={!store.newsletterAvailable || !campaignValid || testing}
              className="ds-btn ds-btn--outline ds-btn--sm">
              <Mail className="size-4" /> {testing ? 'Envoi du test...' : "M'envoyer un test"}
            </button>
            {!confirmSend ?
              <button
                type="button"
                onClick={() => setConfirmSend(true)}
                disabled={!store.newsletterAvailable || !campaignValid || confirmedCount === 0 || campaignBusy}
                className="ds-btn ds-btn--primary">
                <Send className="size-4" /> Envoyer aux abonnés
              </button> :
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>Envoyer à {confirmedCount} abonné{confirmedCount > 1 ? 's' : ''} ?</span>
                <button type="button" onClick={sendCampaign} disabled={sending || campaignBusy} className="ds-btn ds-btn--primary">{sending ? 'Envoi...' : 'Confirmer l’envoi'}</button>
                <button type="button" onClick={() => setConfirmSend(false)} className="ds-btn ds-btn--outline">Annuler</button>
              </div>}
          </div>
          {user?.email && <p className="text-xs ds-muted">Le test est envoyé à {user.email}.</p>}
        </div>
      </section>

      <section>
        <h3 className="ds-title text-[16px]">Envois récents</h3>
        {campaigns.length === 0 ?
          <p className="mt-3 text-sm ds-muted">Aucune campagne envoyée.</p> :
          <ul className="mt-3 ds-card divide-y divide-[var(--ds-border)] overflow-hidden px-4">
            {campaigns.map((campaign) =>
              <li key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{campaign.subject}</p>
                  <p className="mt-0.5 text-xs ds-muted">{formatDateTime(campaign.createdAt)} · {campaign.sentCount}/{campaign.recipientCount} envoyés{campaign.failedCount > 0 ? ` · ${campaign.failedCount} échecs` : ''}{campaign.skippedCount > 0 ? ` · ${campaign.skippedCount} désabonnés` : ''}</p>
                </div>
                <span className="text-xs font-semibold ds-muted">{{ sending: 'En cours', sent: 'Terminé', partial: 'Partiel', failed: 'Échec', interrupted: 'Interrompu' }[campaign.status]}</span>
              </li>
            )}
          </ul>}
      </section>

      {error ?
        <p role="alert" className="rounded-[14px] bg-[var(--ds-danger-soft)] p-4 text-sm text-[var(--ds-danger)]">{error}</p> :
        loading ?
          <p className="py-10 text-center text-sm ds-muted">Chargement des abonnés...</p> :
          filtered.length === 0 ?
            <div className="ds-card py-12 text-center">
              <Mail className="mx-auto size-8 ds-muted" />
              <p className="mt-3 text-sm font-medium">{query ? 'Aucun résultat' : 'Aucun abonné pour le moment'}</p>
            </div> :
            <ul className="ds-card divide-y divide-[var(--ds-border)] overflow-hidden px-4">
              {filtered.map((subscriber) =>
                <li key={subscriber.id} className="flex flex-wrap items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">{subscriber.email}</p>
                    <p className="mt-0.5 text-xs ds-muted">
                      {subscriber.confirmedAt ? `Confirmé le ${formatDateTime(subscriber.confirmedAt)}` : `En attente depuis le ${formatDateTime(subscriber.createdAt)}`}
                    </p>
                  </div>
                  {removingId === subscriber.id ?
                    <div className="flex items-center gap-2 text-xs">
                      <span>Retirer cette adresse ?</span>
                      <button type="button" onClick={() => setRemovingId(null)} className="ds-btn ds-btn--outline ds-btn--sm">Annuler</button>
                      <button type="button" disabled={busyId === subscriber.id} onClick={() => removeSubscriber(subscriber.id)} className="ds-btn ds-btn--sm" style={{ background: 'var(--ds-danger)', color: '#fff' }}>Retirer</button>
                    </div> :
                    <div className="flex items-center gap-1.5">
                      {subscriber.confirmedAt && <button type="button" title="Copier le lien de désabonnement" aria-label={`Copier le lien de désabonnement de ${subscriber.email}`} onClick={() => copyUnsubscribeLink(subscriber.unsubscribeToken)} className="ds-icon-btn ds-icon-btn--sm"><Copy className="size-4" /></button>}
                      <button type="button" title="Retirer l'abonné" aria-label={`Retirer ${subscriber.email}`} onClick={() => setRemovingId(subscriber.id)} className="ds-icon-btn ds-icon-btn--sm" style={{ color: 'var(--ds-danger)' }}><Trash2 className="size-4" /></button>
                    </div>}
                </li>
              )}
            </ul>}
    </div>
  );
}
