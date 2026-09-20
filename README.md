# SELLIA

Application React/Vite avec une API Express reliée à la base MySQL `sellia`.

## Getting Started

1. Démarrer WAMP et MySQL sur le port `3306`.
2. Copier `.env.example` vers `.env` seulement si les identifiants MySQL diffèrent.
3. Exécuter `npm install`.
4. Exécuter `npm run dev` pour lancer l’API et le site.

Compte de démonstration : `grace@novamarket.demo` / `demo1234`.

## Abonnement Stripe Premium (mode test)

1. Révoquer toute clé de test déjà partagée et créer une nouvelle clé restreinte dans Stripe. Ne jamais la committer ni l'ajouter à `VITE_*`.
2. Dans Stripe, créer le produit **SELLIA Premium** avec un prix récurrent de **9 USD par mois**. Copier son identifiant `price_...`.
3. Renseigner `STRIPE_API_KEY`, `STRIPE_PREMIUM_PRICE_ID` et `PUBLIC_APP_URL` hors dépôt (dans `.env` pour le développement local, dans un coffre de secrets en production). La clé publiable n'est pas nécessaire : Checkout est hébergé par Stripe.
4. Configurer le portail client Stripe pour permettre la mise à jour du moyen de paiement et la résiliation.
5. Configurer un webhook vers `https://votre-domaine/api/stripe/webhook` pour `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` et `invoice.payment_failed`. Renseigner son secret de signature dans `STRIPE_WEBHOOK_SECRET`. En local, `stripe listen --forward-to localhost:3001/api/stripe/webhook` fournit un secret temporaire.
6. Redémarrer l'API, puis essayer Checkout avec une carte de test Stripe. Le retour navigateur ne donne jamais Premium à lui seul : l'API attend le webhook signé.

`PUBLIC_APP_URL` doit pointer vers l'adresse du site utilisée par le marchand pendant le test (par exemple `http://localhost:5173` en local ou un domaine HTTPS stable). Un tunnel Cloudflare temporaire exige de mettre cette valeur à jour à chaque nouveau lien. L'API refuse un prix différent de 9 USD mensuels afin que le montant affiché corresponde au montant facturé.

Les boutiques existantes déjà marquées Premium avant Stripe ne sont pas rétroactivement facturées. Une boutique avec abonnement Stripe actif gère ses changements depuis le portail client. Avant la mise en production, confirmer que l'entité juridique de SELLIA est [admissible aux paiements Stripe](https://stripe.com/global) et configurer les obligations fiscales applicables ; l'existence d'un compte de test ne prouve pas cette admissibilité.

## E-mails Premium

Les inscriptions et campagnes des vraies boutiques Premium nécessitent un serveur SMTP. Configure `PUBLIC_APP_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` et `SMTP_FROM` dans `.env`, puis redémarre l'API. `PUBLIC_APP_URL` doit être un domaine HTTPS stable : un lien `trycloudflare.com` temporaire ne convient pas pour les liens de confirmation et de désabonnement. Si le serveur SMTP n'est pas configuré, les inscriptions et les envois restent désactivés. La démo Premium simule l'inscription sans enregistrer d'adresse ni envoyer d'e-mail.

Le domaine de `SMTP_FROM` doit être autorisé chez le fournisseur d'envoi et ses enregistrements DNS (SPF, DKIM, DMARC) doivent être configurés pour une bonne délivrabilité.

Dans **Tableau de bord > Abonnés**, le propriétaire peut envoyer un e-mail de test à sa propre adresse, puis lancer une campagne aux seuls abonnés confirmés. Chaque message réel contient un lien de désabonnement. Les adresses collectées avant l'ajout de la confirmation restent en attente et ne reçoivent pas de campagnes.
