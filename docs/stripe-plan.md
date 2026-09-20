# Plan Stripe pour SELLIA

Le planificateur Stripe MCP a accepté un guide en mode test pour ce cas d'usage (`iguide_61VRBbed4UEcktpQl4117v5BSK6ix`). Le guide final ne contient pas de texte détaillé ; les décisions ci-dessous s'appuient aussi sur la documentation Stripe et sur l'architecture actuelle de SELLIA.

## 1. Abonnement des marchands : Billing + Payments

- Basic reste gratuit, sans carte bancaire et limité à 5 produits publiés.
- Premium est un prix Stripe récurrent de 9 USD par mois. Stripe Checkout hébergé encaisse le premier paiement ; le portail client gère ensuite le moyen de paiement et la résiliation.
- Chaque boutique possède un Customer Stripe et au plus un abonnement Premium. `store_billing` associe leurs identifiants à la boutique ; le serveur applique les droits Premium uniquement après un webhook signé. `stripe_webhook_events` rend les traitements idempotents.
- Surveiller les événements Checkout, Subscription et Invoice, y compris renouvellement, paiement échoué et résiliation. Garder les droits pendant une résiliation en fin de période tant que l'abonnement est actif ; retirer Premium quand son statut ne le permet plus.
- Développer en sandbox/test avec une clé restreinte neuve, un prix de test et un secret de webhook. Ne jamais exposer la clé API au navigateur. Tester réussite, annulation, échec, renouvellement, doublon et désordre des webhooks.

## 2. Paiements des acheteurs : décision métier

Les commandes de produits passent actuellement par WhatsApp. Si chaque marchand doit encaisser lui-même par carte via SELLIA, il faudra déterminer qui est le vendeur légal, qui reçoit l'argent et qui supporte remboursements/litiges. Évaluer alors Stripe Payments + Connect, l'onboarding des marchands et les pays pris en charge. Ne pas traiter les fonds des marchands sur le compte d'abonnement SaaS de SELLIA sans ce modèle. Si WhatsApp reste le canal de vente, aucun checkout acheteur n'est nécessaire pour la phase 1.

## 3. Treasury, Issuing et Terminal : hors phase 1

- Treasury/Financial Accounts n'est pertinent que si SELLIA doit fournir des comptes financiers ou des mouvements d'argent aux marchands.
- Issuing n'est pertinent que si SELLIA doit émettre des cartes de paiement à des utilisateurs ou marchands.
- Terminal n'est pertinent que si des commerçants doivent accepter des paiements physiques avec lecteurs ou Tap to Pay. Le pays du compte Stripe et du lecteur doit correspondre.
- Pour chacun : définir le produit commercial, les pays, les exigences réglementaires et obtenir l'accès Stripe avant d'écrire des flux de production.

## Prérequis avant lancement

1. Confirmer le pays de l'entité juridique de SELLIA et son admissibilité. Un compte de test ne prouve pas l'accès aux paiements réels ; la RDC ne figure pas actuellement dans la liste publique des pays Stripe Payments pris en charge.
2. Configurer un domaine HTTPS stable, clés restreintes par environnement, produit/prix, portail client, destination webhook et supervision des erreurs.
3. Vérifier la TVA/taxe applicable et les enregistrements fiscaux avant d'activer Stripe Tax ; ne pas supposer qu'`automatic_tax` suffit sans inscription fiscale active.
4. Valider la politique d'impayés et de période de grâce. L'implémentation actuelle ne donne Premium qu'aux statuts `active` et `trialing`.

Sources : [abonnements](https://docs.stripe.com/billing/subscriptions/build-subscriptions), [webhooks d'abonnement](https://docs.stripe.com/billing/subscriptions/webhooks), [pays Stripe](https://stripe.com/global), [Connect](https://docs.stripe.com/connect), [Terminal](https://docs.stripe.com/terminal/payments/regional), [taxes récurrentes](https://docs.stripe.com/billing/taxes/collect-taxes).
