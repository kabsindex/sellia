import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useSellia } from '../../contexts/SelliaContext';

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useSellia();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
  setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.firstName || !form.email || !form.whatsapp || form.password.length < 6) {
      setError('Remplis tous les champs. Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        whatsapp: form.whatsapp
      }, form.password);
      setLoading(false);
      navigate('/onboarding');
    } catch (submitError) {
      setLoading(false);
      setError(submitError instanceof Error ? submitError.message : 'Inscription impossible.');
    }
  }

  return (
    <AuthLayout
      title="Crée ton compte SELLIA"
      subtitle="Deux minutes suffisent. Ensuite, on construit ta boutique ensemble."
      footer={
      <>
          Tu as déjà un compte ?{' '}
          <Link to="/connexion" className="font-medium text-brand hover:underline">
            Se connecter
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" value={form.firstName} onChange={set('firstName')} placeholder="Grâce" autoComplete="given-name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" value={form.lastName} onChange={set('lastName')} placeholder="Mukendi" autoComplete="family-name" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={set('email')} placeholder="grace@exemple.com" autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
          <Input id="whatsapp" type="tel" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+243 970 000 111" autoComplete="tel" />
          <p className="text-xs text-muted-foreground">
            C’est sur ce numéro que tes clients t’enverront leurs commandes.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="6 caractères minimum"
              autoComplete="new-password"
              className="pr-10" />
            
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error &&
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        }

        <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Créer ma boutique gratuitement
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          En continuant, tu acceptes les conditions d’utilisation de SELLIA.
        </p>
      </form>
    </AuthLayout>);

}
