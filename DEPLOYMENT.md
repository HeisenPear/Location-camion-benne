# 🚀 Guide de Déploiement

Ce guide vous aidera à déployer le site Location Camion Benne Tours sur différentes plateformes d'hébergement.

## Prérequis

Avant de déployer, assurez-vous d'avoir :
- Complété les informations de contact dans le code
- Testé le site en local avec `npm run dev`
- Réussi le build avec `npm run build`
- Configuré les variables d'environnement si nécessaire

## 📝 Configuration Initiale

### 1. Personnalisation des informations

Remplacez les placeholders suivants dans le code :

**Coordonnées de contact** (rechercher et remplacer) :
- `02 47 XX XX XX` → Votre numéro de téléphone
- `+33247000000` → Votre numéro au format international
- `contact@lcb-tours.fr` → Votre adresse email
- `[À compléter]` dans mentions-legales.astro → Vos informations légales

**URL du site** :
- Dans `astro.config.mjs` : modifier `site: 'https://votredomaine.fr'`

### 2. Variables d'environnement

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Puis éditez `.env` avec vos vraies valeurs.

## 🌐 Déploiement sur Netlify (Recommandé)

Netlify offre un déploiement facile avec CI/CD intégré.

### Via l'interface Web (le plus simple)

1. **Créer un compte** sur [netlify.com](https://netlify.com)

2. **Importer le projet**
   - Cliquer sur "Add new site" → "Import an existing project"
   - Connecter votre repository Git (GitHub, GitLab, Bitbucket)
   - Sélectionner le repository

3. **Configuration du build**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Variables d'environnement**
   - Aller dans Site settings → Environment variables
   - Ajouter vos variables (PUBLIC_SITE_URL, etc.)

5. **Déployer**
   - Netlify construit et déploie automatiquement
   - Chaque push sur la branche principale déclenche un redéploiement

### Configuration du formulaire de contact

Netlify Forms fonctionne automatiquement si vous ajoutez `netlify` à votre form :

```tsx
// Dans ContactForm.tsx, modifier la balise <form>
<form
  name="contact"
  method="POST"
  data-netlify="true"
  onSubmit={handleSubmit}
>
  <input type="hidden" name="form-name" value="contact" />
  {/* reste du formulaire */}
</form>
```

Les soumissions apparaîtront dans Netlify Dashboard → Forms.

### Domaine personnalisé

1. Dans Netlify Dashboard → Domain management
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions

## 🔷 Déploiement sur Vercel

Vercel est également excellent pour les sites Astro.

### Via Vercel CLI

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déployer**
   ```bash
   vercel
   ```

3. **Variables d'environnement**
   ```bash
   vercel env add PUBLIC_SITE_URL
   vercel env add PUBLIC_CONTACT_EMAIL
   ```

### Via l'interface Web

1. Aller sur [vercel.com](https://vercel.com)
2. Importer le projet depuis Git
3. Vercel détecte automatiquement Astro
4. Ajouter les variables d'environnement
5. Déployer

## 📦 Déploiement sur GitHub Pages

GitHub Pages est gratuit pour les repos publics.

### Configuration

1. **Modifier astro.config.mjs**
   ```js
   export default defineConfig({
     site: 'https://username.github.io',
     base: '/repository-name', // Si pas le site principal
     // ...
   });
   ```

2. **Créer le workflow GitHub Actions**

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

3. **Activer Pages**
   - Aller dans Settings → Pages
   - Source : GitHub Actions

## ☁️ Déploiement sur Cloudflare Pages

1. Connecter votre repository Git sur Cloudflare Pages
2. Configuration :
   ```
   Build command: npm run build
   Build output directory: dist
   ```
3. Ajouter les variables d'environnement
4. Déployer

## 🐳 Déploiement Docker (Auto-hébergement)

### Créer un Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build et run

```bash
docker build -t lcb-tours .
docker run -p 80:80 lcb-tours
```

## 📧 Configuration du formulaire de contact

Le formulaire actuel est un placeholder. Voici les options :

### Option 1 : Formspree (le plus simple)

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un nouveau formulaire
3. Récupérer l'endpoint
4. Modifier `ContactForm.tsx` :

```tsx
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

### Option 2 : Netlify Forms

Voir section Netlify ci-dessus.

### Option 3 : Backend personnalisé

Créer une API (Node.js, Python, PHP) qui :
- Reçoit les données POST
- Valide les données
- Envoie un email via SMTP ou service (SendGrid, Mailgun)
- Retourne une réponse JSON

## 🔒 Configuration SSL/HTTPS

Tous les hébergeurs modernes (Netlify, Vercel, Cloudflare) fournissent SSL gratuit automatiquement via Let's Encrypt.

Pour un hébergement personnalisé :
- Utiliser [Certbot](https://certbot.eff.org/) pour Let's Encrypt
- Ou utiliser un certificat payant

## 📊 Analytics (Optionnel)

### Google Analytics

1. Créer une propriété GA4
2. Ajouter le code dans `Layout.astro` (avant `</head>`) :

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible (Recommandé - RGPD friendly)

```html
<script defer data-domain="votredomaine.fr" src="https://plausible.io/js/script.js"></script>
```

## ✅ Checklist de déploiement

Avant de mettre en production :

- [ ] Remplacer tous les placeholders (téléphone, email, etc.)
- [ ] Compléter les mentions légales
- [ ] Tester tous les liens de navigation
- [ ] Vérifier le formulaire de contact
- [ ] Tester la responsivité (mobile, tablette, desktop)
- [ ] Vérifier les performances (Lighthouse)
- [ ] Configurer Google Search Console
- [ ] Créer un sitemap.xml (Astro le génère automatiquement)
- [ ] Tester l'accessibilité
- [ ] Configurer les redirections si nécessaire
- [ ] Ajouter des vraies images des camions
- [ ] Vérifier les meta descriptions SEO

## 🐛 Debugging en production

Si le site ne s'affiche pas correctement :

1. **Vérifier les logs de build**
   - Chaque plateforme a des logs détaillés

2. **Vérifier les chemins**
   - Problèmes fréquents avec `base` dans astro.config.mjs

3. **Variables d'environnement**
   - S'assurer qu'elles sont bien configurées

4. **Cache**
   - Vider le cache du navigateur
   - Forcer un nouveau déploiement

## 📞 Support

Pour toute question sur le déploiement, consulter :
- [Documentation Astro](https://docs.astro.build/en/guides/deploy/)
- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation Vercel](https://vercel.com/docs)

---

**Bon déploiement ! 🚀**
