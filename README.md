# Lettrage Auto

Outil web qui transforme un **export CSV** (PayPal, relevé bancaire, etc.) en
**fichier Excel trié, catégorisé et prêt pour le lettrage comptable**.

On glisse un CSV, l'outil lit / trie / catégorise / rapproche les opérations,
puis génère un classeur `.xlsx` directement exploitable.

> 🔒 **100 % local** : tout le traitement se fait dans le navigateur. Aucune
> donnée financière n'est envoyée sur un serveur.

---

## ✨ Ce que fait l'outil

À partir d'un CSV, il produit un classeur Excel avec **6 feuilles** :

| Feuille | Contenu |
|---|---|
| **📊 Tableau de bord** | Titre + période, **cartes KPI** (nb paiements, CA brut, commissions, net encaissé), comptes (remboursements / retraits / en attente / autres), puis le **détail des paiements reçus**. |
| **🟢 Paiements** | Les paiements valides encaissés, avec bandeau de totaux. |
| **🔴 Remboursements** | Les remboursements émis. |
| **🔵 Autres mouvements** | Retraits, opérations en attente et autres. |
| **📋 Tous les mouvements** | Toutes les opérations triées par date, avec une colonne **Lettrage** reliant les lignes liées par référence (paiement ↔ remboursement ↔ litige). |
| **📅 Synthèse mensuelle** | Récap par mois : ventes, frais, remboursements, net, CA TTC / **TVA estimée** / CA HT, retraits. |

Les feuilles de mouvements partagent les mêmes colonnes : `Statut` (🟢/🔴/🔵/🟡) ·
Date · Heure · Client · Email · Type · État · Brut · Commission · Net · Solde ·
Article · N° Facture · Sens · Source · Pays · N° Transaction · Lettrage.
Les montants sont de **vrais nombres** (sommables), pas du texte.

### Multi-plateformes

L'outil n'est **pas limité à PayPal**. Il repose sur des **profils** qui
décrivent comment lire une source donnée (mapping des colonnes, format des
montants/dates, règles de catégorisation). La plateforme est **détectée
automatiquement** à partir des en-têtes, et peut être forcée manuellement.

Profils inclus :
- **PayPal** (exports « Activité » / « Transactions », FR et EN) ;
- **Banque / générique** (colonnes Date / Libellé / Montant ou Débit / Crédit).

---

## 🚀 Utilisation

### En ligne
Déployé en site statique (Vercel) : ouvrez l'URL, glissez votre CSV,
réglez la TVA si besoin, cliquez sur **Générer le fichier Excel**.

### En local
```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production dans dist/
npm run preview  # prévisualise le build
```

### Démo en ligne de commande
Génère un `.xlsx` à partir du CSV d'exemple (utile pour tester le moteur) :
```bash
npm run demo
# ou avec vos propres fichiers :
npm run demo chemin/source.csv chemin/sortie.xlsx
```

---

## 🧩 Architecture

```
src/
├── core/                 # moteur (sans dépendance au navigateur, testable en Node)
│   ├── types.ts          # types partagés (Transaction, Category, Statut…)
│   ├── csv.ts            # parsing CSV (PapaParse)
│   ├── parse.ts          # montants, dates, encodage
│   ├── normalize.ts      # CSV brut -> opérations normalisées
│   ├── statut.ts         # pastille de statut (🟢/🔴/🔵/🟡)
│   ├── lettrage.ts       # rapprochement par référence (union-find) + codes
│   ├── dashboard.ts      # indicateurs du tableau de bord
│   ├── summary.ts        # synthèse mensuelle
│   ├── pipeline.ts       # orchestration complète
│   └── profiles/         # profils par plateforme
│       ├── profile.ts    # interface Profile + helpers
│       ├── paypal.ts
│       ├── generic.ts
│       └── index.ts      # registre + détection automatique
├── excel/                # génération du classeur (ExcelJS)
│   ├── styles.ts         # couleurs, formats, thèmes
│   ├── workbook.ts       # construit les 6 feuilles
│   └── download.ts       # téléchargement navigateur
├── main.ts               # interface (drag & drop, aperçu, options)
└── style.css
```

### Ajouter une plateforme
1. Créer `src/core/profiles/ma-plateforme.ts` exportant un objet `Profile`
   (mapping des colonnes + fonctions `match` et `categorize`).
2. L'ajouter au tableau `PROFILES` dans `src/core/profiles/index.ts`.

C'est tout : le profil apparaît dans le sélecteur et entre dans la détection
automatique.

---

## 🛠️ Stack
- **Vite** + **TypeScript** (site statique, aucun back-end)
- **PapaParse** — lecture CSV robuste (séparateur auto, guillemets, encodage)
- **ExcelJS** — génération de `.xlsx` mis en forme (couleurs, filtres, totaux)

## ⚠️ Avertissement
La TVA affichée est une **estimation** (CA encaissé supposé TTC × taux saisi).
Cet outil prépare le lettrage : **vérifiez toujours les écritures** avant
intégration dans votre comptabilité.
