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
    <div className="space-y-5 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Abonnés e-mail</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {confirmedCount} abonné{confirmedCount > 1 ? 's' : ''} confirmé{confirmedCount > 1 ? 's' : ''} à {store.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium disabled:opacity-50">
            <RefreshCw className="size-4" /> Actualiser
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={exportable.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium disabled:opacity-50">
            <Download className="size-4" /> Exporter CSV
          </button>
        </div>
      </div>

      <div className="relative max-w-[360px]">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une adresse"
          aria-label="Rechercher un abonné"
          className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand" />
      </div>

      {store.plan !== 'premium' &&
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Les nouvelles inscriptions sont disponibles pour les boutiques Premium.
        </p>}

      <section className="border-y border-border py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Créer une campagne</h3>
            <p className="mt-1 text-sm text-muted-foreground">Les adresses en attente de confirmation ne recevront rien.</p>
          </div>
          <span className="text-sm font-medium text-muted-foreground">{confirmedCount} destinataire{confirmedCount > 1 ? 's' : ''}</span>
        </div>
        {!store.newsletterAvailable &&
          <p role="status" className="mt-4 border-l-2 border-amber-500 pl-3 text-sm text-muted-foreground">
            L'envoi d'e-mails n'est pas configuré pour cette boutique.
          </p>}
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="campaign-subject" className="mb-1.5 block text-sm font-medium">Objet</label>
            <input
              id="campaign-subject"
              value={subject}
              onChange={(event) => { setSubject(event.target.value); setConfirmSend(false); }}
              maxLength={180}
              disabled={!store.newsletterAvailable}
              placeholder="Les nouveautés de la semaine"
              className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50" />
          </div>
          <div>
            <label htmlFor="campaign-body" className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea
              id="campaign-body"
              value={body}
              onChange={(event) => { setBody(event.target.value); setConfirmSend(false); }}
              maxLength={5000}
              rows={6}
              disabled={!store.newsletterAvailable}
              placeholder="Présente tes nouveaux produits et tes offres..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={sendTest}
              disabled={!store.newsletterAvailable || !campaignValid || testing}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium disabled:opacity-50">
              <Mail className="size-4" /> {testing ? 'Envoi du test...' : "M'envoyer un test"}
            </button>
            {!confirmSend ?
              <button
                type="button"
                onClick={() => setConfirmSend(true)}
                disabled={!store.newsletterAvailable || !campaignValid || confirmedCount === 0 || campaignBusy}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white disabled:opacity-50">
                <Send className="size-4" /> Envoyer aux abonnés
              </button> :
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>Envoyer à {confirmedCount} abonné{confirmedCount > 1 ? 's' : ''} ?</span>
                <button type="button" onClick={sendCampaign} disabled={sending || campaignBusy} className="h-10 rounded-lg bg-brand px-4 font-semibold text-white disabled:opacity-50">{sending ? 'Envoi...' : 'Confirmer l’envoi'}</button>
                <button type="button" onClick={() => setConfirmSend(false)} className="h-10 rounded-lg border border-border px-3">Annuler</button>
              </div>}
          </div>
          {user?.email && <p className="text-xs text-muted-foreground">Le test est envoyé à {user.email}.</p>}
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold">Envois récents</h3>
        {campaigns.length === 0 ?
          <p className="mt-3 text-sm text-muted-foreground">Aucune campagne envoyée.</p> :
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {campaigns.map((campaign) =>
              <li key={campaign.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{campaign.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(campaign.createdAt)} · {campaign.sentCount}/{campaign.recipientCount} envoyés{campaign.failedCount > 0 ? ` · ${campaign.failedCount} échecs` : ''}{campaign.skippedCount > 0 ? ` · ${campaign.skippedCount} désabonnés` : ''}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{{ sending: 'En cours', sent: 'Terminé', partial: 'Partiel', failed: 'Échec', interrupted: 'Interrompu' }[campaign.status]}</span>
              </li>
            )}
          </ul>}
      </section>

      {error ?
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> :
        loading ?
          <p className="py-10 text-center text-sm text-muted-foreground">Chargement des abonnés...</p> :
          filtered.length === 0 ?
            <div className="border-y border-border py-12 text-center">
              <Mail className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">{query ? 'Aucun résultat' : 'Aucun abonné pour le moment'}</p>
            </div> :
            <ul className="divide-y divide-border border-y border-border">
              {filtered.map((subscriber) =>
                <li key={subscriber.id} className="flex flex-wrap items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium">{subscriber.email}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {subscriber.confirmedAt ? `Confirmé le ${formatDateTime(subscriber.confirmedAt)}` : `En attente depuis le ${formatDateTime(subscriber.createdAt)}`}
                    </p>
                  </div>
                  {removingId === subscriber.id ?
                    <div className="flex items-center gap-2 text-xs">
                      <span>Retirer cette adresse ?</span>
                      <button type="button" onClick={() => setRemovingId(null)} className="rounded-lg border border-border px-2.5 py-2">Annuler</button>
                      <button type="button" disabled={busyId === subscriber.id} onClick={() => removeSubscriber(subscriber.id)} className="rounded-lg bg-red-600 px-2.5 py-2 font-semibold text-white disabled:opacity-50">Retirer</button>
                    </div> :
                    <div className="flex items-center gap-1.5">
                      {subscriber.confirmedAt && <button type="button" title="Copier le lien de désabonnement" aria-label={`Copier le lien de désabonnement de ${subscriber.email}`} onClick={() => copyUnsubscribeLink(subscriber.unsubscribeToken)} className="grid size-9 place-items-center rounded-lg border border-border"><Copy className="size-4" /></button>}
                      <button type="button" title="Retirer l'abonné" aria-label={`Retirer ${subscriber.email}`} onClick={() => setRemovingId(subscriber.id)} className="grid size-9 place-items-center rounded-lg border border-border text-red-600"><Trash2 className="size-4" /></button>
                    </div>}
                </li>
              )}
            </ul>}
    </div>
  );
}
