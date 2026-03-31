import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
export function AuthPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handlePhoneSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };
  const handleCodeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/onboarding");
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-sellia-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-sellia-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <span className="text-2xl font-bold text-sellia-primary tracking-tight">
            SELLIA
          </span>
        </Link>
        <h2 className="text-3xl font-extrabold text-sellia-text">
          {step === 1 ? "Connecte-toi" : "Vérification WhatsApp"}
        </h2>
        <p className="mt-2 text-sm text-sellia-muted">
          {step === 1
            ? "Entre ton numéro WhatsApp pour continuer."
            : "Entre le code à 4 chiffres envoyé sur WhatsApp."}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="py-8 px-4 sm:px-10 shadow-xl border-none">
          {step === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <Input
                label="Numéro WhatsApp"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                icon={<Phone size={18} />}
                required
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                icon={<ArrowRight size={18} />}
              >
                Recevoir le code
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-sellia-muted mt-4">
                <ShieldCheck size={14} className="text-green-500" />
                Tes données sont sécurisées
              </div>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-sellia-text mb-3 text-center">
                  Code de vérification
                </label>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border border-sellia-border focus:ring-2 focus:ring-sellia-accent focus:border-sellia-accent bg-slate-50"
                      required
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                Vérifier et continuer
              </Button>
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="text-sm text-sellia-accent font-medium hover:underline"
                  onClick={() => setStep(1)}
                >
                  Je n'ai pas reçu le code
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
