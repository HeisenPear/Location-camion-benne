# 🚚 Location Camion Benne Tours - Site Vitrine

Site web vitrine moderne et performant pour une entreprise de location de camions benne à Tours (Indre-et-Loire, 37).

## ✨ Caractéristiques

- **Framework moderne** : Astro + React pour des performances optimales
- **Design responsive** : Mobile-first, adapté à tous les écrans
- **SEO optimisé** : Meta tags, Schema.org, sitemap
- **Animations fluides** : Framer Motion pour des micro-interactions
- **Performance** : Lazy loading, code splitting, images optimisées
- **Accessibilité** : Navigation clavier, ARIA labels, contraste WCAG AA

## 🛠 Stack Technique

- **Framework** : [Astro](https://astro.build/) v5.16+
- **UI Library** : [React](https://react.dev/) v19.2+
- **Styling** : [TailwindCSS](https://tailwindcss.com/) v4.1+
- **Icons** : [Lucide React](https://lucide.dev/)
- **Animations** :
  - [Framer Motion](https://www.framer.com/motion/) - Toutes les animations et micro-interactions
- **TypeScript** : Configuration stricte

## 📁 Structure du Projet

```
location-camion-benne-tours/
├── public/                  # Assets statiques
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── react/          # Composants React
│   │   │   ├── Button.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   └── VehicleCard.tsx
│   │   └── sections/       # Sections réutilisables
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal avec SEO
│   ├── pages/              # Routes du site
│   │   ├── index.astro     # Page d'accueil
│   │   ├── services.astro
│   │   ├── notre-flotte.astro
│   │   ├── tarifs.astro
│   │   ├── zone-intervention.astro
│   │   ├── contact.astro
│   │   ├── mentions-legales.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css      # Styles globaux + Tailwind
├── astro.config.mjs        # Configuration Astro
├── tsconfig.json           # Configuration TypeScript
└── package.json
```

## 🚀 Commandes

Toutes les commandes s'exécutent depuis la racine du projet :

| Commande              | Action                                          |
| :-------------------- | :---------------------------------------------- |
| `npm install`         | Installe les dépendances                        |
| `npm run dev`         | Lance le serveur de dev sur `localhost:4321`    |
| `npm run build`       | Construit le site de production vers `./dist/`  |
| `npm run preview`     | Prévisualise le build en local                  |
| `npm run astro ...`   | Exécute des commandes Astro CLI                 |

## 🎨 Palette de Couleurs

- **Primaire** : Orange (`#FF6B35`) - Secteur BTP/Industriel
- **Secondaire** : Gris anthracite (`#2D3436`)
- **Accent** : Bleu professionnel (`#0984E3`)
- **Neutre** : Blanc, gris clair, gris foncé

## 📄 Pages du Site

### 1. Accueil (`/`)
- Hero avec CTA principaux
- Section avantages (4 cards)
- Services principaux
- Aperçu de la flotte
- Témoignages clients
- Zone d'intervention
- CTA final

### 2. Services (`/services`)
- 4 services détaillés :
  - Évacuation gravats et déchets
  - Transport de matériaux
  - Démolition et débarras
  - Terrassement
- Secteurs d'activité (Particuliers, BTP, Collectivités, Entreprises)

### 3. Notre Flotte (`/notre-flotte`)
- 6 types de véhicules avec specs complètes
- Section entretien & sécurité
- Équipements et options

### 4. Tarifs (`/tarifs`)
- Grille tarifaire indicative (3 bennes)
- Facteurs influençant le prix
- Options supplémentaires
- Appel à devis personnalisé

### 5. Zone d'Intervention (`/zone-intervention`)
- Rayon de 50km autour de Tours
- Liste complète des villes (37)
- Départements limitrophes
- Contraintes d'accès

### 6. Contact (`/contact`)
- Formulaire de contact complet
- Coordonnées (téléphone, email, adresse, horaires)
- Carte (placeholder)
- FAQ rapide

### 7. Mentions Légales (`/mentions-legales`)
- Informations légales complètes
- RGPD et protection des données
- Politique de cookies

### 8. Page 404 (`/404`)
- Message personnalisé
- Liens vers pages principales
- CTA retour accueil

## 🧩 Composants React Réutilisables

### HeroSection
Section hero moderne avec animations Anime.js
```tsx
<HeroSection client:load />
```
Animations incluses :
- Titre animé mot par mot
- Éléments flottants en arrière-plan
- Badge avec pulsation
- Stats avec effet stagger
- Scroll indicator animé

### AnimatedSection
Wrapper pour animer des sections au scroll
```tsx
<AnimatedSection
  animation="slideUp"
  delay={200}
  client:visible
>
  <div>Contenu animé</div>
</AnimatedSection>
```
Types d'animations : `fadeIn`, `slideUp`, `slideLeft`, `slideRight`, `scaleIn`, `staggerFadeIn`

### ParticleBackground
Fond animé avec particules (optionnel)
```tsx
<ParticleBackground
  particleCount={30}
  color="#FF6B35"
  client:visible
/>
```

### Button
Bouton avec 3 variants (primary, secondary, outline) et 3 tailles (sm, md, lg)
```tsx
<Button variant="primary" size="lg" href="/contact">
  Obtenir un devis
</Button>
```

### ServiceCard
Card pour afficher un service avec icône, titre, description et lien optionnel
```tsx
<ServiceCard
  icon={Trash2}
  title="Évacuation gravats"
  description="..."
  link="/services#evacuation"
/>
```

### VehicleCard
Card détaillée pour un véhicule de la flotte avec specs et features
```tsx
<VehicleCard
  name="Benne 8m³"
  capacity="8m³"
  payload="3,5 tonnes"
  dimensions="4m x 2m x 1m"
  features={[...]}
/>
```

### ContactForm
Formulaire de contact complet avec validation et feedback visuel
```tsx
<ContactForm client:load />
```

### Header
Navigation sticky responsive avec menu mobile animé
```tsx
<Header client:load />
```

### Footer
Footer multi-colonnes avec liens, infos légales et réseaux sociaux
```tsx
<Footer client:load />
```

## 🔧 Configuration SEO

Chaque page inclut :
- Meta title et description uniques
- Keywords ciblés (local SEO)
- Open Graph et Twitter Cards
- Schema.org JSON-LD (LocalBusiness)
- Canonical URL

## 📱 Responsive Design

Breakpoints TailwindCSS :
- **sm** : 640px
- **md** : 768px
- **lg** : 1024px
- **xl** : 1280px

Mobile-first approach avec navigation hamburger, tap targets > 48px.

## ⚡ Performance

- Images WebP avec fallback
- Lazy loading (`client:visible`, `client:load`)
- Code splitting automatique par page
- Minification CSS/JS
- Fonts optimisées (Inter via Google Fonts)

## 🎯 Mots-clés SEO Ciblés

- Location camion benne Tours
- Camion benne Indre-et-Loire
- Évacuation gravats Tours
- Location benne avec chauffeur 37
- Transport déchets chantier Tours
- Location camion grappin Tours

## 🔐 RGPD & Confidentialité

- Consentement explicite pour collecte de données
- Droits d'accès, rectification, effacement
- Politique de cookies transparente
- Page mentions légales complète

## 📞 Informations de Contact (Placeholder)

- **Téléphone** : 02 47 XX XX XX
- **Email** : contact@lcb-tours.fr
- **Adresse** : Tours et environs, Indre-et-Loire (37)
- **Horaires** : Lun-Sam 7h-19h, Urgences 7j/7

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

Le site statique sera généré dans le dossier `dist/`.

### Hébergeurs recommandés
- [Netlify](https://netlify.com) - Déploiement continu depuis Git
- [Vercel](https://vercel.com) - Performance optimale
- [GitHub Pages](https://pages.github.com) - Gratuit pour projets publics
- [Cloudflare Pages](https://pages.cloudflare.com) - CDN global

### Variables d'environnement
Créer un fichier `.env` pour les configurations sensibles :
```env
PUBLIC_SITE_URL=https://votredomaine.fr
PUBLIC_CONTACT_EMAIL=contact@votredomaine.fr
PUBLIC_PHONE=+33247000000
```

## 🎨 Personnalisation

### Modifier les couleurs
Éditer `src/styles/global.css` et les composants pour ajuster la palette :
```css
/* Couleurs principales */
--color-primary: #FF6B35;    /* Orange */
--color-secondary: #2D3436;  /* Gris foncé */
--color-accent: #0984E3;     /* Bleu */
```

### Ajouter des pages
1. Créer un fichier `.astro` dans `src/pages/`
2. Ajouter le lien dans `Header.tsx` et `Footer.tsx`
3. Configurer le SEO dans le frontmatter

### Modifier le formulaire de contact
Le formulaire est dans `src/components/react/ContactForm.tsx`. Pour l'intégrer avec un service d'email :
- [Formspree](https://formspree.io)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- API backend personnalisée

## 📚 Ressources

- [Documentation Astro](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/icons)

## 📝 TODO / Améliorations Futures

- [ ] Intégrer Google Maps API pour la carte interactive
- [ ] Ajouter des images réelles des camions benne
- [ ] Configurer Formspree ou Netlify Forms pour le formulaire
- [ ] Ajouter un blog pour le SEO (actualités, conseils BTP)
- [ ] Implémenter un système de réservation en ligne
- [ ] Ajouter des témoignages clients réels avec photos
- [ ] Intégrer Google Analytics ou Plausible
- [ ] Créer une galerie de réalisations/chantiers
- [ ] Ajouter un chatbot ou chat en direct
- [ ] Optimiser les images avec des vrais visuels

## 📄 Licence

Ce projet est un site vitrine professionnel développé pour Location Camion Benne Tours.

---

**Développé avec ❤️ en utilisant Astro, React et TailwindCSS**

Pour toute question ou modification, contactez le développeur.
