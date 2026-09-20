import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MailX } from 'lucide-react';
import { api } from '../../utils/api';

export function Unsubscribe() {
  const { token } = useParams();
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function unsubscribe() {
    if (!token || pending) return;
    setPending(true);
    setError('');
    try {
      await api('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ token }) });
      setDone(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Désabonnement impossible.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-[#102019]">
      <div className="w-full max-w-[440px]">
        <MailX className="size-9 text-[#11834e]" />
        <h1 className="mt-5 text-2xl font-semibold">Désabonnement</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#62726a]">
          {done ? 'Ton adresse a été retirée de la liste. Tu ne recevras plus les nouveautés de cette boutique.' : 'Confirme pour ne plus recevoir les nouveautés et offres de cette boutique.'}
        </p>
        {!done &&
          <button type="button" onClick={unsubscribe} disabled={pending} className="mt-6 h-11 rounded-lg bg-[#11834e] px-5 text-sm font-semibold text-white disabled:opacity-60">
            {pending ? 'Désabonnement...' : 'Confirmer le désabonnement'}
          </button>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <Link to="/" className="mt-5 block w-fit text-sm text-[#11834e] underline">Retour à SELLIA</Link>
      </div>
    </main>
  );
}
