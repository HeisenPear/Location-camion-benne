# RP Location de Benne - Site Web

Site vitrine pour RP Location de Benne à Tours (37) - Location de bennes pour professionnels et particuliers.

## 🚀 Stack Technique

- **Framework:** Astro 4.x (SSG)
- **UI Components:** React 18 (Islands Architecture)
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **TypeScript:** Strict mode
- **SEO:** Schema.org, Sitemap XML, robots.txt

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🎨 Images Placeholder

Les images suivantes doivent être ajoutées dans le dossier `public/images/` :

### Images requises :

- `hero-benne.jpg` (600x400px min) - Photo d'une benne pour le hero de la homepage
- `benne-10m3.jpg` (800x600px min) - Benne 10m³
- `benne-15m3.jpg` (800x600px min) - Benne 15m³
- `benne-20m3.jpg` (800x600px min) - Benne 20m³
- `benne-30m3.jpg` (800x600px min) - Benne 30m³
- `benne-gravats.jpg` (800x600px min) - Benne gravats
- `benne-tout-venant.jpg` (800x600px min) - Benne tout-venant
- `benne-bois.jpg` (800x600px min) - Benne bois
- `og-default.jpg` (1200x630px) - Image Open Graph par défaut

### Format recommandé :
- Format : WebP (avec fallback JPG)
- Résolution : 2x pour les écrans Retina
- Optimisation : Compression avec TinyPNG ou ImageOptim

### Placeholders temporaires :
Pour tester le site sans images, vous pouvez utiliser des placeholders de https://placehold.co/ ou https://via.placeholder.com/

## 🗺️ Google Maps

Pour activer Google Maps :

1. Obtenir une API key sur [Google Cloud Console](https://console.cloud.google.com/)
2. Les iframes Google Maps sont déjà configurés dans les pages
3. Restreindre la clé au domaine en production pour la sécurité

## 📝 Contenu

Tous les contenus actuels sont des **placeholders réalistes**. Remplacer :

- `/src/data/company.json` - Informations réelles de l'entreprise (adresse, téléphone, email, SIRET, TVA)
- `/src/data/services.json` - Tarifs et descriptions réels des services
- `/src/data/zones.json` - Zones d'intervention et tarifs de livraison réels
- `/src/data/testimonials.json` - Vrais témoignages clients
- `/src/data/faq.json` - Questions fréquentes adaptées

## 🎯 SEO

Le site est optimisé pour le SEO local :

- ✅ Schema.org LocalBusiness sur toutes les pages
- ✅ Meta tags optimisés (title, description, OG, Twitter Card)
- ✅ Sitemap XML généré automatiquement
- ✅ robots.txt configuré
- ✅ URLs optimisées et parlantes
- ✅ Breadcrumbs avec Schema.org
- ✅ Alt text sur images (à personnaliser avec vraies images)
- ✅ Performance Lighthouse 95+ (objectif)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints : 640px, 768px, 1024px, 1280px
- Navigation mobile avec hamburger menu animé (Framer Motion)
- Touch-friendly (44px min target size)
- Sticky header avec effet au scroll

## 🚀 Déploiement

### Netlify / Vercel (Recommandé)

```bash
# Build command
npm run build

# Publish directory
dist

# Node version
18.x ou supérieur
```

### Variables d'environnement (optionnel)
Créer un fichier `.env` si nécessaire :
```
PUBLIC_GOOGLE_MAPS_API_KEY=votre_clé_ici
```

## 📊 Performance

Objectifs Lighthouse :
- Performance : 95+
- Accessibility : 95+
- Best Practices : 95+
- SEO : 95+

Optimisations incluses :
- CSS critical inline
- Images lazy loading
- Fonts optimisées (preload, font-display: swap)
- Code-splitting React components (client:visible, client:load)
- Compression Astro (CSS, HTML, JS)

## 🧞 Commandes

| Commande | Action |
|:---------|:-------|
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de dev sur `localhost:4321` |
| `npm run build` | Build le site pour la production dans `./dist/` |
| `npm run preview` | Prévisualise le build localement |
| `npm run astro check` | Vérification TypeScript |

## 📂 Structure du Projet

```
/
├── public/
│   ├── images/          # Images à ajouter
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── animations/  # Wrappers Framer Motion
│   │   ├── forms/       # ContactForm, PriceCalculator
│   │   ├── layout/      # Header, Footer, Navigation
│   │   ├── sections/    # Hero, ServicesGrid, FAQ, etc.
│   │   └── ui/          # Button, Card, Input, Textarea
│   ├── data/            # Fichiers JSON de contenu
│   ├── layouts/         # BaseLayout avec SEO
│   ├── pages/           # Pages du site (Astro)
│   ├── styles/          # global.css
│   └── types/           # Types TypeScript
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## 🎨 Personnalisation

### Couleurs (Tailwind)
Modifier `tailwind.config.mjs` :
- `primary` : Bleu principal (#3b82f6)
- `secondary` : Orange (#f97316)
- `neutral` : Gris (#6b7280)

### Fonts
Modifier `src/styles/global.css` :
- Sans : Inter Variable
- Display : Montserrat

## 📞 Support Technique

- Documentation Astro : https://docs.astro.build
- Tailwind CSS : https://tailwindcss.com/docs
- Framer Motion : https://www.framer.com/motion/
- React : https://react.dev

## ✅ Checklist Avant Mise en Production

- [ ] Remplacer toutes les images placeholder
- [ ] Mettre à jour company.json avec vraies informations
- [ ] Mettre à jour les tarifs dans services.json
- [ ] Mettre à jour les zones dans zones.json
- [ ] Ajouter vrais témoignages clients
- [ ] Configurer Google Maps API key
- [ ] Tester tous les formulaires mailto:
- [ ] Vérifier robots.txt et sitemap
- [ ] Test Lighthouse (95+ sur tous scores)
- [ ] Test responsive sur tous devices
- [ ] Test navigation et tous les liens
- [ ] Validation W3C HTML
- [ ] Test Google Rich Results (Schema.org)

## 📄 License

Propriétaire - RP Location de Benne © 2026
