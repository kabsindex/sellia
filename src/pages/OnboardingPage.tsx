import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Store, Package, MessageCircle, Rocket, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const steps = [
  {
    id: 1,
    title: 'Boutique',
    icon: <Store size={20} />
  },
  {
    id: 2,
    title: 'Produit',
    icon: <Package size={20} />
  },
  {
    id: 3,
    title: 'WhatsApp',
    icon: <MessageCircle size={20} />
  },
  {
    id: 4,
    title: 'Lancement',
    icon: <Rocket size={20} />
  }];

  const nextStep = () => {
    if (step < 4) setStep(step + 1);else
    navigate('/dashboard');
  };
  return (
    <div className="min-h-screen bg-sellia-bg flex flex-col">
      {/* Top Progress Bar */}
      <div className="bg-white border-b border-sellia-border px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            {steps.map((s) =>
            <div
              key={s.id}
              className="flex flex-col items-center gap-1 relative z-10">
              
                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.id ? 'bg-sellia-accent text-white' : 'bg-slate-100 text-slate-400'}`}>
                
                  {step > s.id ? <Check size={20} /> : s.icon}
                </div>
                <span
                className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-sellia-text' : 'text-slate-400'}`}>
                
                  {s.title}
                </span>
              </div>
            )}
            {/* Connecting Lines */}
            <div className="absolute top-9 left-0 w-full h-1 bg-slate-100 -z-0 hidden sm:block">
              <div
                className="h-full bg-sellia-accent transition-all duration-500"
                style={{
                  width: `${(step - 1) / 3 * 100}%`
                }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 1 &&
            <motion.div
              key="step1"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}>
              
                <Card className="p-6 sm:p-10 shadow-xl border-none">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Store size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-sellia-text mb-2">
                      Comment s'appelle ta boutique ?
                    </h2>
                    <p className="text-sellia-muted">
                      C'est le nom que tes clients verront.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Input
                    placeholder="Ex: Sneakers Pro, Beauté Bio..."
                    autoFocus />
                  
                    <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={nextStep}>
                    
                      Continuer
                    </Button>
                  </div>
                </Card>
              </motion.div>
            }

            {step === 2 &&
            <motion.div
              key="step2"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}>
              
                <Card className="p-6 sm:p-10 shadow-xl border-none">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Package size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-sellia-text mb-2">
                      Ajoute ton premier produit
                    </h2>
                    <p className="text-sellia-muted">
                      Tu pourras en ajouter d'autres plus tard.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Input
                    label="Nom du produit"
                    placeholder="Ex: T-shirt basique" />
                  
                    <Input
                    label="Prix"
                    type="number"
                    placeholder="0.00"
                    icon={<span className="text-sm">€</span>} />
                  
                    <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={nextStep}>
                    
                      Ajouter le produit
                    </Button>
                    <Button variant="ghost" fullWidth onClick={nextStep}>
                      Passer cette étape
                    </Button>
                  </div>
                </Card>
              </motion.div>
            }

            {step === 3 &&
            <motion.div
              key="step3"
              initial={{
                opacity: 0,
                x: 20
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              exit={{
                opacity: 0,
                x: -20
              }}>
              
                <Card className="p-6 sm:p-10 shadow-xl border-none">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-sellia-text mb-2">
                      Connecte ton WhatsApp
                    </h2>
                    <p className="text-sellia-muted">
                      Pour que l'IA puisse répondre et relancer tes clients.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mb-6">
                    <p className="text-sm font-medium text-sellia-text mb-4">
                      Scanne ce QR Code avec ton WhatsApp
                    </p>
                    <div className="w-48 h-48 bg-white border-2 border-dashed border-slate-300 mx-auto flex items-center justify-center rounded-lg">
                      <span className="text-slate-400 text-sm">
                        QR Code Mockup
                      </span>
                    </div>
                  </div>
                  <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={nextStep}>
                  
                    J'ai scanné le code
                  </Button>
                </Card>
              </motion.div>
            }

            {step === 4 &&
            <motion.div
              key="step4"
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.95
              }}>
              
                <Card className="p-6 sm:p-10 shadow-xl border-none text-center">
                  <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Rocket size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-sellia-text mb-4">
                    Tout est prêt ! 🎉
                  </h2>
                  <p className="text-sellia-muted mb-8">
                    Ta boutique est en ligne et ton assistant IA est prêt à
                    vendre. Partage ton lien et encaisse tes premières
                    commandes.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 flex items-center justify-between">
                    <span className="font-medium text-sellia-primary truncate">
                      sellia.app/ma-boutique
                    </span>
                    <Button variant="outline" size="sm">
                      Copier
                    </Button>
                  </div>
                  <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={nextStep}>
                  
                    Aller au Dashboard
                  </Button>
                </Card>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}
