# 📱 Simulateur IZItopo App + GPS RTK

## 🎯 Description

Simulateur web interactif complet permettant de démontrer le fonctionnement de IZItopo App avec un simulateur GPS RTK intégré. Parfait pour les démonstrations clients !

Le simulateur permet de simuler des levés topographiques en temps réel avec un GPS RTK virtuel, enregistrer des points et visualiser les données dans un format CSV.

---

## ✨ Fonctionnalités

### 🗺️ Simulateur GPS RTK (Gauche)

**Cible interactive 2D (X, Y) :**
- Cliquez sur la cible pour déplacer le GPS
- Échelle réelle : rayon de 1 mètre avec graduations tous les 0.25m
- Visualisation du point GPS en temps réel avec halo de précision
- Point animé avec "bruit" simulé selon les précisions configurées

**Barre Z verticale :**
- Slider vertical interactif de -1m à +1m
- Gradient de couleur (rouge en bas, vert en haut)
- Contrôle précis de l'altitude avec pas de 0.01m
- Affichage en temps réel de la valeur Z

**Configuration GPS :**
- Coordonnées du centre (X, Y, Z) personnalisables
- Choix du statut RTK : **Fixe** / **Flottant** / **Autonome**
- Précisions configurables :
  - Hrms max (précision horizontale)
  - Vrrms max (précision verticale)
- Affichage temps réel :
  - Position actuelle (X, Y, Z)
  - Deltas par rapport au centre
  - Précisions Hrms et Vrrms
  - Nombre de satellites (27-31)

**Boutons :**
- **Définir comme centre** : Redéfinir le point de référence
- **Réinitialiser position** : Retour au centre de la cible

### 📱 Simulateur IZItopo App (Droite - Haut)

**Navigation :**
1. **Écran d'accueil** : "Simulateur IZItopo" avec bouton Démarrer
2. **Splash screen** : Logo TCract (2 secondes)
3. **Menu principal** : 3 modes disponibles
   - 📱 Prise Photo (à venir)
   - 📍 Mode Canne (fonctionnel)
   - 🎯 Implantation (à venir)
4. **Mode Canne** : Écran de levé topographique

**Mode Canne - Interface authentique :**

*Header :*
- Titre "Mode canne"
- Compteur de points enregistrés
- Hauteur de canne affichée

*Carte RTK (synchronisée avec GPS) :*
- Hrms et Vrrms en temps réel
- Nombre de satellites
- Statut RTK avec badge coloré (Fixe/Flottant/Autonome)

*Formulaire de saisie :*
- **Hauteur canne** : modifiable (défaut : 2m)
- **Matricule du point** : auto-incrémentée après chaque enregistrement
- **Points de contrôle** : checkbox optionnelle
- **Code** : saisie via pop-up ou manuelle

*Pop-up de codes :*
- Codes prédéfinis : 102, 105, 120, 150, 204 20, via, arb, cro
- Bouton "Del" pour effacer
- Bouton "Libre" pour saisie manuelle

*Actions :*
- **Enregistrer un point** : bouton vert principal
- **Confirmation visuelle** : "Position enregistrée" (2 secondes)
- **Bouton retour** : ◀ en bas à gauche pour revenir au menu

### 📊 Liste des Points Enregistrés (Droite - Bas)

**Format CSV avec colonnes séparées :**
```
Matricule | X | Y | Z | Code | Hrms | Vrms | Satellites | Diffstatus | Horodatage
```

**Caractéristiques :**
- En-tête fixe (reste visible lors du scroll)
- Police monospace (Courier New)
- Colonnes visuellement séparées avec bordures
- Ordre chronologique : premier point en haut, dernier en bas
- Scroll vertical automatique si plus de 600px
- Effet hover sur chaque ligne
- Compteur de points dans l'en-tête

**Données enregistrées (format identique au CSV IZItopo) :**
- **Matricule** : numéro du point
- **X, Y, Z** : coordonnées GPS (3 décimales) + hauteur canne pour Z
- **Code** : code du point (vide si non renseigné)
- **Hrms** : précision horizontale au moment de la capture
- **Vrms** : précision verticale au moment de la capture
- **Satellites** : nombre de satellites au moment de la capture
- **Diffstatus** : 4=Fixe, 5=Flottant, 1=Autonome
- **Horodatage** : heure d'enregistrement (HH:MM:SS)

### 🔄 Communication Temps Réel

**Synchronisation automatique GPS → App :**
- Mise à jour continue des données RTK dans l'app (1x/seconde)
- Hrms, Vrrms varient aléatoirement dans les limites configurées
- Satellites varient entre 27 et 31
- Badge de statut change de couleur selon le mode RTK
- Données transmises également au menu principal

**Simulation réaliste :**
- Bruit GPS ajouté selon les précisions configurées
- Animation du point GPS (vibration légère)
- Calcul du Z final = Z GPS + hauteur canne + bruit vertical

---

## 🚀 Installation

### Prérequis
- Python 3.8+
- pip

### Installation rapide

```bash
# 1. Aller dans le dossier du projet
cd simulateur-izitopo

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer le serveur
python app.py

# 4. Ouvrir dans le navigateur
http://localhost:5000
```

---

## 📖 Guide d'utilisation

### Configuration initiale du GPS

1. **Définir les coordonnées du centre** :
   - Entrez X, Y, Z du point de référence
   - Cliquez sur "Définir comme centre"

2. **Configurer les précisions** :
   - Hrms max : 0.030m (par défaut) - précision horizontale
   - Vrrms max : 0.050m (par défaut) - précision verticale
   - Plus la valeur est élevée, plus le bruit est important

3. **Choisir le statut RTK** :
   - **Fixe** (vert) : précision centimétrique - Diffstatus = 4
   - **Flottant** (orange) : précision décimétrique - Diffstatus = 5
   - **Autonome** (rouge) : précision métrique - Diffstatus = 1

### Simulation d'un levé topographique

**Étape 1 : Démarrer l'application**
- Sur l'écran du téléphone, cliquez sur "Démarrer"
- Attendez le splash screen
- Dans le menu, cliquez sur "Mode Canne"

**Étape 2 : Positionner le GPS (simulateur de gauche)**
- Cliquez sur la cible pour déplacer le GPS en X et Y
- Utilisez la barre Z pour ajuster l'altitude
- Observez les données RTK se mettre à jour dans l'app

**Étape 3 : Enregistrer des points (app de droite)**
1. Vérifiez/modifiez la hauteur de canne (défaut : 2m)
2. La matricule s'incrémente automatiquement (101, 102, 103...)
3. Ajoutez un code si nécessaire (optionnel) :
   - Cliquez sur "..." pour ouvrir le pop-up
   - Sélectionnez un code prédéfini ou "Libre" pour saisie manuelle
4. Cliquez sur "Enregistrer un point"
5. Confirmez visuellement : "Position enregistrée"

**Étape 4 : Continuer le levé**
- Déplacez le GPS vers une nouvelle position (clic sur la cible)
- Ajustez Z si nécessaire (slider vertical)
- La matricule s'est auto-incrémentée
- Enregistrez le nouveau point
- Répétez l'opération

**Étape 5 : Visualiser les points**
- La liste CSV en bas à droite se remplit automatiquement
- Chaque ligne contient toutes les informations du point
- Scroll dans la liste pour voir tous les points

### Navigation

- **Retour au menu** : Bouton ◀ en bas à gauche du Mode Canne
- **Retour splash/menu** : Bouton "Démarrer" sur l'écran d'accueil
- **Reset GPS** : Bouton "Réinitialiser position" dans le simulateur GPS

---

## 📁 Structure du projet

```
simulateur-izitopo/
│
├── app.py                          # Serveur Flask (backend)
│
├── requirements.txt                # Dépendances Python (Flask)
│
├── README.md                       # Documentation complète
│
├── templates/                      # Templates HTML
│   └── index.html                  # Page principale (interface complète)
│
└── static/                         # Fichiers statiques
    │
    ├── css/                        # Styles
    │   └── style.css               # CSS complet (GPS + App + CSV)
    │
    ├── js/                         # JavaScript
    │   ├── gps.js                  # Simulateur GPS + cible + barre Z
    │   ├── app.js                  # Simulateur IZItopo App + navigation
    │   └── sync.js                 # Communication GPS ↔ App
    │
    └── images/                     # Images
        └── logo.svg                # Logo TCract
```

---

## 🎨 Personnalisation

### Modifier les coordonnées par défaut

Dans `static/js/gps.js` :
```javascript
this.centerX = 547892.000;  // Votre X
this.centerY = 6458123.000; // Votre Y
this.centerZ = 145.000;     // Votre Z
```

### Modifier les codes prédéfinis

Dans `templates/index.html`, section pop-up codes :
```html
<button class="code-btn">102</button>
<button class="code-btn">105</button>
<button class="code-btn">VotreCode</button>
```

### Modifier les précisions par défaut

Dans `static/js/gps.js` :
```javascript
this.hrmsMax = 0.030;  // Précision horizontale max
this.vrrmsMax = 0.050; // Précision verticale max
```

### Modifier la hauteur de canne par défaut

Dans `templates/index.html` :
```html
<input type="number" id="hauteurInput" value="2" step="0.01">
```

### Modifier la matricule de départ

Dans `templates/index.html` :
```html
<input type="text" id="matriculeInput" value="101">
```

### Modifier les couleurs

Dans `static/css/style.css` :
```css
/* Vert foncé header/boutons */
#1a4d3f, #2d6b4f

/* Statuts RTK */
.status-fixe: #4caf50 (vert)
.status-flottant: #ff9800 (orange)  
.status-autonome: #f44336 (rouge)
```

---

## 🔧 Déploiement

### Déploiement local avec Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Déploiement sur Railway

1. Créer un compte sur Railway.app
2. Connecter votre repository GitHub
3. Railway détectera automatiquement Flask
4. Aucune variable d'environnement nécessaire
5. L'application sera accessible via l'URL Railway

### Déploiement sur Heroku

1. Créer un `Procfile` :
```
web: gunicorn app:app
```

2. Déployer :
```bash
heroku create votre-app-izitopo
git push heroku main
```

---

## 📊 Format des données

### Structure du CSV généré

```csv
Matricule;X;Y;Z;Code;Hrms;Vrms;Satellites;Diffstatus;Horodatage
100;547892.123;6458123.456;145.234;;0.011;0.020;29;4;14:23:15
101;547893.456;6458124.789;145.567;102;0.010;0.018;30;4;14:24:32
102;547894.789;6458126.012;145.890;via;0.012;0.021;28;4;14:25:48
```

### Description des colonnes

| Colonne | Type | Description | Exemple |
|---------|------|-------------|---------|
| Matricule | Text | Numéro du point | 101 |
| X | Float | Coordonnée Est (3 déc.) | 547892.123 |
| Y | Float | Coordonnée Nord (3 déc.) | 6458123.456 |
| Z | Float | Altitude + hauteur canne (3 déc.) | 145.234 |
| Code | Text | Code du point (optionnel) | via, 102, arb |
| Hrms | Float | Précision horizontale (3 déc.) | 0.011 |
| Vrms | Float | Précision verticale (3 déc.) | 0.020 |
| Satellites | Integer | Nombre de satellites | 29 |
| Diffstatus | Integer | Statut différentiel (4/5/1) | 4 |
| Horodatage | Time | Heure d'enregistrement | 14:23:15 |

### Correspondance Diffstatus

- **4** = Fixe (précision centimétrique)
- **5** = Flottant (précision décimétrique)
- **1** = Autonome (précision métrique)

---

## 🎓 Conseils d'utilisation

### Pour une démo client réussie

1. **Préparation** :
   - Configurez les coordonnées du centre avant la démo
   - Choisissez des précisions réalistes (Hrms: 0.010-0.030m)
   - Préremplissez la première matricule

2. **Scénario type** :
   - Démarrez par le splash screen pour montrer le branding
   - Montrez le menu principal avec les 3 modes
   - Entrez dans Mode Canne
   - Expliquez l'interface et les données RTK
   - Simulez 5-10 points de levé
   - Montrez la liste CSV qui se remplit

3. **Points d'attention** :
   - Les données RTK changent en temps réel → réalisme
   - La hauteur de canne s'ajoute au Z → précision
   - L'auto-incrémentation → productivité
   - Le système de codes → organisation

### Pour tester différents scénarios

**Scénario 1 : Levé en mode Fixe (optimal)**
- Statut : Fixe
- Hrms max : 0.015m
- Vrrms max : 0.025m
- Satellites : stables à 29-31

**Scénario 2 : Conditions dégradées (Flottant)**
- Statut : Flottant
- Hrms max : 0.050m
- Vrrms max : 0.080m
- Satellites : 27-29

**Scénario 3 : Sans RTK (Autonome)**
- Statut : Autonome
- Hrms max : 2.000m
- Vrrms max : 3.000m
- Satellites : variables

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# Vérifier que Flask est installé
pip list | grep Flask

# Réinstaller si nécessaire
pip install --upgrade Flask
```

### L'interface ne s'affiche pas correctement

- Vider le cache du navigateur (Ctrl+F5 ou Cmd+Shift+R)
- Vérifier la console JavaScript (F12)
- Vérifier que tous les fichiers CSS/JS sont chargés

### Les données GPS ne se synchronisent pas

- Ouvrir la console JavaScript (F12)
- Vérifier que les événements `gpsUpdate` apparaissent
- Vérifier qu'il n'y a pas d'erreur JavaScript

### Les points ne s'enregistrent pas

- Vérifier que la hauteur canne est renseignée
- Vérifier que la matricule est renseignée
- Vérifier la console pour les erreurs

### Le bouton retour ne fonctionne pas

- Vérifier que `backToMenuBtn` est présent dans le HTML
- Vérifier dans la console qu'il n'y a pas d'erreur JS
- Rafraîchir la page

---

## 📝 Notes techniques

### Échelle de la cible GPS

- **Rayon** : 1 mètre réel
- **Conversion** : 150 pixels = 1 mètre
- **Graduations** : 0.25m, 0.5m, 0.75m, 1m
- **Précision clic** : ~0.007m par pixel

### Calcul du bruit GPS

```javascript
X_simulé = X_réel + random(-Hrms, +Hrms)
Y_simulé = Y_réel + random(-Hrms, +Hrms)
Z_simulé = Z_réel + random(-Vrrms, +Vrrms)
```

### Calcul du Z final enregistré

```javascript
Z_final = Z_GPS + Hauteur_canne + bruit_vertical
```

### Fréquence de mise à jour

- **Précisions RTK** : 1 fois par seconde
- **Satellites** : 1 fois par seconde
- **Animation point GPS** : 60 FPS
- **Synchronisation GPS → App** : Temps réel (événements)

### Limites techniques

- Maximum ~1000 points avant ralentissement
- Scroll automatique après 600px de hauteur
- Format CSV limité à la mémoire du navigateur
- Pas de sauvegarde persistante (refresh = reset)

---

## 🔮 Fonctionnalités à venir

### Prochaines versions

- **Export CSV** : Téléchargement du fichier des points
- **Import CSV** : Charger des points existants
- **Mode Prise Photo** : Simulation de l'acquisition de photos géolocalisées
- **Mode Implantation** : Simulation de l'implantation de points
- **Gestion de projets** : Plusieurs levés distincts
- **Graphiques** : Visualisation 2D des points levés
- **Statistiques** : Analyse des précisions (min/max/moyenne)
- **Historique** : Retour en arrière / annuler dernier point

---

## 👨‍💻 Auteur & Contact

**TCract / IZItopo**
- **Fondateur** : Arnaud
- **Produit** : IZItopo - Suite logicielle topographie & photogrammétrie
  - IZItopo App (Android - RTK GPS)
  - IZItopo Calcul (Traitement photogrammétrique)
  - IZItopo Draw (Conversion 2D vers 3D)
- **Partenariats** : Bentley Systems, Trimble

---

## 📄 Licence

© 2025 TCract. Tous droits réservés.

Ce simulateur est un outil de démonstration pour IZItopo App.

---

## 🙏 Remerciements

Merci d'utiliser le simulateur IZItopo App + GPS RTK !

Pour toute question ou suggestion d'amélioration, n'hésitez pas à nous contacter.

---

**Version** : 2.0.0  
**Dernière mise à jour** : Octobre 2025  
**Compatibilité** : Navigateurs modernes (Chrome, Firefox, Safari, Edge)
