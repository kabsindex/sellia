import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useSellia } from '../../contexts/SelliaContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useSellia();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email || !password) {
      setError('Entre ton email et ton mot de passe.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const onboardingComplete = await login(email, password);
      setLoading(false);
      navigate(onboardingComplete ? '/dashboard' : '/onboarding');
    } catch (submitError) {
      setLoading(false);
      setError(submitError instanceof Error ? submitError.message : 'Connexion impossible.');
    }
  }

  return (
    <AuthLayout
      title="Content de te revoir 👋"
      subtitle="Connecte-toi pour gérer ta boutique et tes commandes."
      footer={
      <>
          Pas encore de boutique ?{' '}
          <Link to="/inscription" className="font-medium text-brand hover:underline">
            Créer mon compte
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email" />
          
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              to="/mot-de-passe-oublie"
              className="text-xs text-muted-foreground hover:text-foreground">
              
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
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
          Se connecter
        </Button>
      </form>
    </AuthLayout>);

}
