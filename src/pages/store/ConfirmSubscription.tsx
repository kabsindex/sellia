import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { api } from '../../utils/api';

export function ConfirmSubscription() {
  const { token } = useParams();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function confirm() {
    if (!token || pending) return;
    setPending(true);
    setError('');
    try {
      await api('/newsletter/confirm', { method: 'POST', body: JSON.stringify({ token }) });
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Confirmation impossible.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-[#102019]">
      <div className="w-full max-w-[440px]">
        <MailCheck className="size-9 text-[#11834e]" />
        <h1 className="mt-5 text-2xl font-semibold">Confirme ton adresse</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#62726a]">
          {done ? 'Ton adresse est confirmée. Tu peux maintenant recevoir les nouveautés de cette boutique.' : 'Valide ton inscription pour recevoir les nouveautés et offres de la boutique.'}
        </p>
        {!done &&
          <button type="button" onClick={confirm} disabled={pending} className="mt-6 h-11 rounded-lg bg-[#11834e] px-5 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? 'Confirmation...' : 'Confirmer mon adresse'}
          </button>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error} Tu peux demander un nouveau lien depuis la boutique.</p>}
        <Link to="/" className="mt-5 block w-fit text-sm text-[#11834e] underline">Retour à SELLIA</Link>
      </div>
    </main>
  );
}
