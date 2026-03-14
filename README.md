# 🛒 Marché - Liste de Courses

Une application web moderne pour gérer votre liste de courses avec facilité. Ajoutez des articles, catégorisez-les, cochez-les au fur et à mesure de vos achats, et consultez votre historique.

## ✨ Fonctionnalités

- ✅ **Ajouter des articles** avec nom, quantité et catégorie
- ✅ **8 catégories prédéfinies** : Fruits & Légumes, Viandes & Poissons, Produits laitiers, Épicerie, Boissons, Hygiène & Beauté, Surgelés, Autres
- ✅ **Cocher les articles** au fur et à mesure de vos achats
- ✅ **Barre de progression** en temps réel
- ✅ **Filtrer par catégorie** pour une meilleure organisation
- ✅ **Historique** des articles cochés avec date/heure
- ✅ **Persistance locale** - Les données sont sauvegardées dans votre navigateur
- ✅ **Design responsive** - Fonctionne sur desktop, tablette et mobile

## 🚀 Accès à l'application

### Option 1 : GitHub Pages (recommandé)
L'application est accessible directement via GitHub Pages :
```
https://luiscoixao.github.io/Courses/
```

### Option 2 : Serveur local
Clonez le repository et lancez un serveur local :
```bash
git clone https://github.com/luiscoixao/Courses.git
cd Courses
python3 -m http.server 8000
# Accédez à http://localhost:8000
```

## 📁 Structure des fichiers

```
Courses/
├── index.html      # Structure HTML
├── styles.css      # Styles et design
├── app.js          # Logique JavaScript
└── README.md       # Documentation
```

## 🎨 Design

- **Thème vert naturel** inspiré par l'univers des courses
- **Interface intuitive** avec modal d'ajout fluide
- **Animations douces** pour une meilleure UX
- **Badges de catégories** avec emoji et couleurs distinctives

## 💾 Stockage des données

Les données sont sauvegardées localement dans le navigateur (localStorage) :
- Aucun serveur requis
- Données privées et sécurisées
- Persistance même après fermeture du navigateur

## 🛠️ Technologie

- **HTML5** - Structure sémantique
- **CSS3** - Design responsive et animations
- **JavaScript vanilla** - Pas de dépendances externes

## 📱 Compatibilité

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎯 Utilisation

1. **Ouvrez l'application** via le lien GitHub Pages
2. **Cliquez sur le bouton +** pour ajouter un article
3. **Remplissez le formulaire** (nom, quantité, catégorie)
4. **Cliquez sur "Ajouter"**
5. **Cochez les articles** au fur et à mesure de vos achats
6. **Consultez l'historique** pour voir vos articles cochés

## 📊 Barre de progression

La barre de progression affiche en temps réel :
- Le pourcentage d'articles cochés
- Le nombre d'articles cochés / total
- Un message de félicitations quand la liste est complète

## 🏷️ Catégories

- 🥦 Fruits & Légumes
- 🥩 Viandes & Poissons
- 🧀 Produits laitiers
- 🛒 Épicerie
- 🥤 Boissons
- 🧴 Hygiène & Beauté
- ❄️ Surgelés
- 📦 Autres

## 🔧 Développement

Pour modifier l'application :

1. Clonez le repository
2. Modifiez les fichiers (`index.html`, `styles.css`, `app.js`)
3. Testez localement
4. Commitez et poussez vers GitHub
5. Les changements seront automatiquement déployés sur GitHub Pages

## 📝 Licence

Ce projet est libre d'utilisation. Vous pouvez le modifier et le distribuer librement.

## 👨‍💻 Auteur

Créé avec ❤️ par Manus

---

**Profitez de vos courses ! 🛒✨**
