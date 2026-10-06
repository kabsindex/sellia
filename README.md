# SELLIA

SELLIA est une plateforme de commerce **WhatsApp-first** pensée pour les vendeurs qui utilisent déjà WhatsApp pour présenter leurs produits, discuter avec leurs clients et finaliser leurs ventes.

Son objectif est simple :

> **Transformer WhatsApp en machine de vente.**

SELLIA ne cherche pas à remplacer WhatsApp. La plateforme structure tout ce qui se passe **avant** la conversation finale : catalogue, découverte des produits, variantes, panier, informations de commande et gestion côté vendeur.

---

## Le problème que SELLIA résout

Beaucoup de vendeurs vendent encore de façon entièrement manuelle sur WhatsApp :

- le client demande les photos ;
- le vendeur renvoie les mêmes photos ;
- le client demande le prix ;
- le vendeur répète le prix ;
- le client demande les tailles, couleurs ou disponibilités ;
- plusieurs conversations s’accumulent ;
- les commandes deviennent difficiles à suivre.

SELLIA transforme ce parcours en une expérience structurée.

Le vendeur crée une vraie boutique en ligne, ajoute ses produits et partage simplement son lien SELLIA.

Le client peut alors consulter les produits, rechercher, filtrer, choisir ses variantes, ajouter au panier et préparer sa commande sans demander chaque information au vendeur.

La finalisation de la commande reste naturellement connectée à **WhatsApp**.

---

## Parcours vendeur

Depuis le dashboard SELLIA, le vendeur peut notamment :

1. créer et configurer sa boutique ;
2. ajouter et modifier ses produits ;
3. gérer les catégories ;
4. renseigner prix, photos, description, stock, tailles et couleurs ;
5. gérer les commandes ;
6. suivre ses clients ;
7. consulter ses statistiques ;
8. personnaliser l'apparence de sa boutique ;
9. ouvrir et partager sa boutique publique.

Le dashboard a été conçu comme un véritable back-office de commerce, utilisable sur mobile et desktop.

---

## Parcours client

Chaque vendeur possède une boutique publique accessible via une URL du type :

```
/:slug
```

Le client peut notamment :

- parcourir l'accueil de la boutique ;
- consulter le catalogue ;
- rechercher un produit ;
- ouvrir une fiche produit ;
- choisir taille et couleur ;
- ajouter aux favoris ;
- ajouter au panier ;
- modifier les quantités ;
- consulter le total ;
- cliquer sur **Commander sur WhatsApp**.

SELLIA prépare alors une commande structurée afin que le vendeur et le client puissent terminer l'échange sur WhatsApp.

### Important

SELLIA n'est pas conçu comme un marketplace classique où le client doit forcément créer un compte et payer directement sur la plateforme.

Le cœur de l'expérience est :

**Boutique SELLIA → Produit → Panier → WhatsApp**

---

## Les trois interfaces principales

### 1. Landing page

La landing présente le produit SELLIA et montre le fonctionnement réel de la plateforme.

### 2. Storefront

Le Storefront est la boutique publique vue par le client.

Il comprend notamment :

- accueil ;
- catégories ;
- recherche ;
- fiches produits ;
- favoris ;
- panier ;
- informations de la boutique ;
- CTA WhatsApp.

Le Storefront est pensé **mobile-first**, tout en restant adapté aux écrans desktop.

### 3. Dashboard vendeur

Le Dashboard permet au vendeur de gérer son activité :

- aperçu ;
- produits ;
- catégories ;
- commandes ;
- clients ;
- statistiques ;
- boutique ;
- apparence ;
- paramètres.

---

## Source visuelle actuelle

Le design de référence actuellement utilisé pour la refonte complète se trouve sur la branche :

```
feat/sellia-refonte-complete
```

Pull Request correspondante :

```
#5 — SELLIA: refonte complète storefront, dashboard et landing
```

Cette branche doit être utilisée comme **source de vérité visuelle** pour comprendre le nouveau SELLIA.

Les interfaces présentes dans le code doivent être privilégiées comme référence plutôt que d'inventer un autre langage visuel.

Des composants comme `MiniStorefront` reproduisent volontairement le Storefront réel afin de garder une cohérence entre démonstrations marketing et produit.

---

## Direction produit

SELLIA doit donner l'impression d'un SaaS moderne, simple et crédible.

Principes visuels :

- mobile-first ;
- interfaces propres et lisibles ;
- peu de friction ;
- vert SELLIA utilisé principalement comme accent ;
- fonds blancs / gris clairs ;
- typographie nette ;
- cartes et composants cohérents ;
- animations utiles à la compréhension ;
- continuité visuelle entre Landing, Dashboard et Storefront.

Les démonstrations du produit doivent utiliser autant que possible les **vraies interfaces SELLIA**.

---

## Ce qu'une présentation ou vidéo de SELLIA doit montrer

Une présentation visuelle de SELLIA doit se concentrer sur les **capacités du produit** et le problème qu'il résout.

Exemple de narration :

**vente désorganisée sur WhatsApp**
→ **SELLIA structure le catalogue**
→ **le vendeur publie ses produits**
→ **le client visite la boutique**
→ **le client choisit son produit et ses variantes**
→ **le panier est préparé**
→ **la commande est envoyée sur WhatsApp**
→ **le vendeur retrouve son activité dans son dashboard**

### Pricing / offres commerciales

Les tarifs et offres commerciales de SELLIA sont susceptibles d'évoluer.

Ils ne doivent donc **pas être utilisés comme élément central d'une présentation, d'un storyboard ou d'une vidéo produit**, sauf instruction explicite ultérieure.

Pour les présentations visuelles, se concentrer sur :

- le problème ;
- la solution ;
- le parcours vendeur ;
- le parcours client ;
- les fonctionnalités réelles ;
- la valeur créée par SELLIA.

---

## Stack technique

Frontend :

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router

Backend :

- Node.js
- Express
- MySQL

Autres briques présentes dans le projet :

- gestion de session ;
- upload média ;
- e-mails ;
- analytics ;
- intégrations de facturation côté plateforme.

---

## Lancer le projet en local

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Le script lance le frontend Vite et l'API Express.

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

---

## Démo

Compte de démonstration existant :

```
grace@novamarket.demo
demo1234
```

Une boutique de démonstration est également disponible dans le projet sous le slug :

```
/novamarket
```

---

## Pour les outils IA / agents de développement

Avant de proposer un changement visuel ou de produire une présentation de SELLIA :

1. lire ce README ;
2. inspecter la branche `feat/sellia-refonte-complete` ;
3. examiner les vraies interfaces Landing, Dashboard et Storefront ;
4. réutiliser leur design comme référence ;
5. ne pas inventer de fonctionnalités qui n'existent pas ;
6. ne pas transformer SELLIA en marketplace avec paiement client intégré ;
7. ne pas utiliser de tarifs ou d'offres commerciales dans une présentation sans demande explicite.

Le produit réel doit toujours rester la source de vérité.
