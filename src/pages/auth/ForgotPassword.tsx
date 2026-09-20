import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Entre une adresse email valide.');
      return;
    }
    setError(null);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  return (
    <AuthLayout
      title="Mot de passe oublié ?"
      subtitle="Entre ton email, on t’envoie un lien pour en créer un nouveau."
      footer={
      <Link to="/connexion" className="font-medium text-brand hover:underline">
          Retour à la connexion
        </Link>
      }>
      
      {sent ?
      <div
        role="status"
        className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
        
          <span className="mx-auto grid size-11 place-items-center rounded-full bg-brand-soft">
            <CheckCircle2 className="size-5 text-brand-strong" />
          </span>
          <h2 className="mt-4 font-heading text-base font-semibold">Email envoyé</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Si un compte existe pour <span className="font-medium text-foreground">{email}</span>, tu
            recevras un lien de réinitialisation dans quelques instants.
          </p>
          <Button variant="outline" className="mt-5 w-full" onClick={() => setSent(false)}>
            Utiliser un autre email
          </Button>
        </div> :

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="grace@exemple.com"
            autoComplete="email" />
          
          </div>

          {error &&
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
        }

          <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Envoyer le lien
          </Button>
        </form>
      }
    </AuthLayout>);

}