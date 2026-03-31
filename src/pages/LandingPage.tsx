import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Zap,
  TrendingUp,
  ShoppingBag,
  ArrowRight } from
'lucide-react';
export function LandingPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sellia-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}>
            
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Nouveau : L'IA répond à tes clients 24/7
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-sellia-primary tracking-tight mb-6 leading-tight">
              Transforme ton WhatsApp en <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sellia-accent to-emerald-400">
                machine de vente
              </span>
            </h1>
            <p className="text-xl text-sellia-muted max-w-2xl mx-auto mb-10">
              Vends, automatise et développe ton business sans complexité.
              SELLIA n'est pas juste une boutique, c'est ton assistant
              commercial intelligent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 rounded-2xl shadow-lg shadow-green-500/30">
                  
                  Commencer en 2 minutes
                </Button>
              </Link>
              <p className="text-sm text-sellia-muted sm:hidden">
                Gratuit • Sans carte bancaire
              </p>
            </div>
            <p className="hidden sm:block text-sm text-sellia-muted mt-4">
              Gratuit • Sans carte bancaire • Configuration en 2 min
            </p>
          </motion.div>

          {/* Hero Image/Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.2
            }}
            className="mt-16 relative max-w-4xl mx-auto">
            
            <div className="aspect-[16/9] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100"></div>
              {/* Abstract Dashboard Representation */}
              <div className="relative z-10 w-full h-full p-8 flex flex-col gap-6">
                <div className="flex gap-4 items-center border-b border-slate-200 pb-4">
                  <div className="w-12 h-12 bg-sellia-primary rounded-xl"></div>
                  <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
                </div>
                <div className="flex gap-6 h-full">
                  <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-4">
                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-green-50 rounded-lg border border-green-100"></div>
                    <div className="h-10 w-full bg-slate-50 rounded-lg"></div>
                    <div className="h-10 w-full bg-slate-50 rounded-lg"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex gap-4">
                      <div className="h-24 flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                      <div className="h-24 flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                      <div className="h-24 flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sellia-primary mb-4">
              Plus qu'un catalogue. Un vrai business.
            </h2>
            <p className="text-lg text-sellia-muted max-w-2xl mx-auto">
              Oublie les tâches répétitives. SELLIA s'occupe de la vente pendant
              que tu dors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg bg-slate-50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-sellia-text mb-3">
                Automatisation
              </h3>
              <p className="text-sellia-muted">
                Relance les paniers abandonnés et envoie des messages de
                bienvenue automatiquement.
              </p>
            </Card>

            <Card className="border-none shadow-lg bg-slate-50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-sellia-text mb-3">
                CRM Intelligent
              </h3>
              <p className="text-sellia-muted">
                Garde une trace de chaque client, ses préférences et son
                historique d'achat.
              </p>
            </Card>

            <Card className="border-none shadow-lg bg-slate-50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-sellia-text mb-3">
                Analytics
              </h3>
              <p className="text-sellia-muted">
                Comprends ce qui se vend le mieux et optimise tes revenus avec
                des données claires.
              </p>
            </Card>

            <Card className="border-none shadow-lg bg-slate-50 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-bold text-sellia-text mb-3">
                Boutique Express
              </h3>
              <p className="text-sellia-muted">
                Une vitrine mobile ultra-rapide, optimisée pour les connexions
                faibles.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-sellia-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Lance ton business en 3 étapes simples, directement depuis ton
              téléphone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-800 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-sellia-accent mb-6 border-4 border-sellia-primary">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Crée ta boutique</h3>
              <p className="text-slate-400">
                Inscris-toi avec ton numéro de téléphone et personnalise ta
                vitrine en 1 minute.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-3xl font-bold text-sellia-accent mb-6 border-4 border-sellia-primary">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Ajoute tes produits</h3>
              <p className="text-slate-400">
                Prends des photos, fixe tes prix et gère ton stock facilement
                depuis l'app.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-sellia-accent rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 border-4 border-sellia-primary shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Commence à vendre</h3>
              <p className="text-slate-400">
                Partage ton lien sur WhatsApp, Instagram ou Facebook et encaisse
                tes premières ventes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sellia-primary mb-4">
              Ils ont explosé leurs ventes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              name: 'Amina T.',
              biz: 'Vendeuse de cosmétiques',
              quote:
              "Je perdais un temps fou à répondre aux mêmes questions. Maintenant SELLIA s'en occupe et mes ventes ont doublé."
            },
            {
              name: 'Karim B.',
              biz: 'Boutique de sneakers',
              quote:
              "La relance des paniers abandonnés est magique. J'ai récupéré plus de 500€ de ventes perdues le premier mois."
            },
            {
              name: 'Sarah M.',
              biz: 'Créatrice de bijoux',
              quote:
              "L'interface est tellement simple. Pas besoin d'être un pro de l'informatique pour avoir une boutique qui fait pro."
            }].
            map((testimonial, i) =>
            <Card key={i} className="p-8">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map((star) =>
                <svg
                  key={star}
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 20 20">
                  
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
                </div>
                <p className="text-sellia-text text-lg italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-bold text-sellia-primary">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-sellia-muted">
                    {testimonial.biz}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-sellia-primary mb-6">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-xl text-sellia-muted mb-10">
            Rejoins des milliers de vendeurs qui utilisent SELLIA pour
            automatiser leur business sur WhatsApp.
          </p>
          <Link to="/auth">
            <Button
              variant="primary"
              size="lg"
              className="text-lg px-10 py-5 rounded-2xl shadow-xl shadow-green-500/20"
              icon={<ArrowRight size={24} />}>
              
              Lance ton business gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>);

}
