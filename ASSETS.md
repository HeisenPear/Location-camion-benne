# 📸 Guide des Assets et Images

Ce document liste tous les assets nécessaires pour compléter le site.

## 🚚 Images de Camions Benne (Priorité Haute)

Le site utilise actuellement des placeholders gradient. Voici les images recommandées :

### Photos de la flotte

1. **Benne 8m³**
   - Photo principale : vue 3/4 avant
   - Photo secondaire : benne en action sur chantier
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB (optimisé)

2. **Benne 15m³**
   - Photo principale : vue 3/4 avant
   - Photo secondaire : benne en action
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB

3. **Benne 20m³**
   - Photo principale : vue 3/4 avant
   - Photo secondaire : benne grappin en action
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB

4. **Benne Grappin**
   - Photo avec grappin visible
   - En action si possible
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB

5. **Benne Ampliroll**
   - Système de dépôt visible
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB

6. **Camion Plateau**
   - Vue complète du plateau
   - Format : JPG, 1200x800px minimum
   - Poids : < 500KB

### Où placer les images

Créer les dossiers dans `public/` :
```
public/
├── images/
│   ├── fleet/
│   │   ├── benne-8m3.jpg
│   │   ├── benne-15m3.jpg
│   │   ├── benne-20m3.jpg
│   │   ├── benne-grappin.jpg
│   │   ├── benne-ampliroll.jpg
│   │   └── camion-plateau.jpg
│   ├── hero/
│   │   └── hero-background.jpg
│   └── services/
│       ├── evacuation-gravats.jpg
│       ├── transport-materiaux.jpg
│       ├── demolition.jpg
│       └── terrassement.jpg
```

### Modifier les composants pour utiliser les images

Dans `VehicleCard.tsx`, l'image est déjà supportée :
```tsx
<VehicleCard
  name="Benne 8m³"
  image="/images/fleet/benne-8m3.jpg"
  // ... autres props
/>
```

## 🎨 Branding

### Logo

1. **Logo principal**
   - Format : SVG (préféré) ou PNG transparent
   - Versions : couleur + blanc (pour fond sombre)
   - Fichiers :
     - `public/logo.svg`
     - `public/logo-white.svg`

2. **Favicon**
   - Fichier actuel : `public/favicon.svg`
   - Formats recommandés :
     - favicon.ico (16x16, 32x32, 48x48)
     - apple-touch-icon.png (180x180)
     - favicon-32x32.png
     - favicon-16x16.png

Générateur recommandé : [RealFaviconGenerator](https://realfavicongenerator.net/)

## 📷 Photos de Chantiers (Optionnel mais recommandé)

Pour la galerie ou le portfolio :

1. **Chantiers réalisés**
   - 10-15 photos de qualité
   - Avant/après si possible
   - Différents types de chantiers
   - Format : JPG, 1200x800px
   - Poids : < 500KB chacune

2. **Équipe en action**
   - Photos des chauffeurs avec les camions
   - Humanise l'entreprise
   - Format : JPG, 800x600px

## 🗺️ Carte interactive (Optionnel)

Pour remplacer le placeholder de carte sur la page Contact :

### Option 1 : Google Maps Embed

```html
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
  width="100%"
  height="400"
  style="border:0;"
  allowfullscreen=""
  loading="lazy"
></iframe>
```

### Option 2 : Mapbox ou OpenStreetMap

Plus respectueux de la vie privée, mais nécessite une intégration JS.

## 📐 Spécifications Techniques des Images

### Formats recommandés

- **Photos** : JPG (qualité 80-85%)
- **Graphiques/logos** : SVG (préféré) ou PNG
- **Icons** : SVG (déjà géré par Lucide React)

### Optimisation

Outils recommandés :
- [TinyPNG](https://tinypng.com/) - Compression sans perte
- [Squoosh](https://squoosh.app/) - Compression avancée
- [ImageOptim](https://imageoptim.com/) (Mac)

### Formats modernes

Pour une performance optimale, convertir en WebP :
```bash
# Avec cwebp (installer via homebrew/apt)
cwebp -q 80 input.jpg -o output.webp
```

Puis utiliser avec fallback :
```html
<picture>
  <source srcset="/images/fleet/benne-8m3.webp" type="image/webp">
  <img src="/images/fleet/benne-8m3.jpg" alt="Benne 8m³">
</picture>
```

## 🎨 Palette de Couleurs à Respecter

Lors de la création de graphiques ou images :

- **Orange primaire** : #FF6B35
- **Gris anthracite** : #2D3436
- **Bleu accent** : #0984E3
- **Blanc** : #FFFFFF
- **Gris clair** : #F7F7F7

## 📝 Guidelines Photos

### Pour les photos de camions

- **Éclairage** : Lumière naturelle, éviter les ombres dures
- **Arrière-plan** : Propre et professionnel
- **Angle** : 3/4 avant pour montrer volume et détails
- **Qualité** : Nette, bien cadrée
- **Branding** : Logo visible si possible

### Pour les photos de chantiers

- **Contexte** : Montrer le camion en situation réelle
- **Action** : Chargement, déchargement, manœuvres
- **Avant/Après** : Valorisant pour les réalisations
- **Sécurité** : Équipements visibles (casques, gilets)

## 📥 Workflow d'Intégration

1. **Préparation**
   - Redimensionner les images
   - Optimiser le poids
   - Renommer selon la convention

2. **Upload**
   - Placer dans `public/images/`
   - Respecter la structure de dossiers

3. **Intégration**
   - Modifier les composants pour pointer vers les vraies images
   - Ajouter des alt texts descriptifs

4. **Test**
   - Vérifier l'affichage sur mobile/desktop
   - Tester les performances (Lighthouse)

## 🎯 Alt Texts Recommandés

Exemples d'alt texts SEO-friendly :

```tsx
// Bon
<img src="..." alt="Camion benne 8m³ location Tours - Évacuation gravats" />

// Mauvais
<img src="..." alt="Camion" />
```

## 📊 Checklist Assets

- [ ] 6 photos de camions haute qualité
- [ ] Logo SVG + PNG versions
- [ ] Favicon complet (tous formats)
- [ ] 5-10 photos de chantiers
- [ ] Photos d'équipe (optionnel)
- [ ] Images optimisées (WebP + fallback)
- [ ] Alt texts descriptifs ajoutés
- [ ] Test de performance fait

## 💡 Ressources Gratuites (Si pas de photos propres)

En attendant vos propres photos :

- [Unsplash](https://unsplash.com/) - Photos gratuites haute qualité
- [Pexels](https://www.pexels.com/) - Stock photos
- [Pixabay](https://pixabay.com/) - Images libres de droits

Rechercher : "dump truck", "construction truck", "tipper truck", etc.

⚠️ **Important** : Vérifier les licences et créditer si nécessaire.

## 📞 Support

Pour toute question sur les assets, dimensions recommandées ou optimisation, n'hésitez pas à demander.

---

**Astuce** : Prendre de bonnes photos de votre flotte est un investissement qui valorise votre entreprise ! 📸
