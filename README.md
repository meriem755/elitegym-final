# ÉLITE GYM — Frontend React

## 🚀 Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer en développement
```bash
npm run dev
# Ouvre http://localhost:5173
```

### 3. Lancer le backend (dans un autre terminal)
```bash
cd ../backend
npm run dev
# Écoute sur http://localhost:3000
```

---

## 📁 Structure des fichiers

```
src/
├── App.jsx                    ← Routing principal (TU MODIFIES ICI pour ajouter les pages)
├── main.jsx                   ← Point d'entrée
├── index.css                  ← Variables CSS + styles globaux
│
├── contexts/
│   └── AuthContext.jsx        ← État global de connexion (useAuth hook)
│
├── services/
│   └── api.js                 ← Toutes les appels vers le backend
│
├── components/
│   └── ProtectedRoute.jsx     ← Protège les routes par rôle
│
└── pages/
    ├── HomePage.jsx           ← Accueil complet (Navbar, Hero, Planning, Tarifs, Coachs, Contact, Footer)
    └── LoginPage.jsx          ← Formulaire login (téléphone + mot de passe)
```

---

## 🔐 Système d'authentification

### Connexion par numéro de téléphone
- Tous les utilisateurs se connectent avec leur **numéro de téléphone** + mot de passe
- Le backend détecte le rôle dans la BDD et renvoie la page de destination

### Redirection automatique selon le rôle
| Rôle          | Page         |
|---------------|-------------|
| membre        | /membre     |
| coach         | /coach      |
| administrateur| /admin      |
| receptionniste| /reception  |
| gerant        | /gerant     |

### Utiliser l'auth dans n'importe quel composant
```jsx
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { user, isLoggedIn, logout } = useAuth();
  
  if (!isLoggedIn) return <p>Non connecté</p>;
  return <p>Bonjour {user.prenom} ({user.role})</p>;
}
```

---

## 🤝 Pour tes coéquipiers

### Ajouter ta page dans App.jsx
```jsx
// 1. Importer ta page
import MembrePage from './pages/MembrePage';

// 2. Remplacer le Placeholder
<Route path="/membre" element={
  <ProtectedRoute allowedRoles={['membre']}>
    <MembrePage />  {/* ← remplace <Placeholder role="membre" /> */}
  </ProtectedRoute>
} />
```

### Utiliser l'API dans ta page
```jsx
import api from '../services/api';

// Requête authentifiée (token envoyé automatiquement)
const data = await api.authFetch('/mes-reservations');

// Requête publique
const cours = await api.getCours('lun');
```

### Protéger ta page
Ta page est déjà protégée par `ProtectedRoute` dans App.jsx.
Mais tu peux aussi vérifier le rôle dans ta page :
```jsx
const { user } = useAuth();
if (user.role !== 'membre') return <Navigate to="/" />;
```

---

## 🌐 Workflow Git recommandé

```bash
# Chaque coéquipier travaille sur sa branche
git checkout -b feature/page-membre     # Équipier A
git checkout -b feature/page-coach      # Équipier B
git checkout -b feature/page-admin      # Équipier C

# Quand c'est prêt, merge dans main
git checkout main
git merge feature/page-membre
```

---

## ⚙️ Variables d'environnement

Crée un fichier `.env` à la racine du frontend si besoin :
```env
VITE_API_URL=http://localhost:3000/api
```

Puis dans api.js remplace `'http://localhost:3000/api'` par `import.meta.env.VITE_API_URL`.

---

## 📱 Comptes de test (après `npm run init` dans le backend)

| Rôle          | Téléphone        | Mot de passe  |
|---------------|-----------------|---------------|
| Administrateur| +213550000001   | Admin@2026    |
| Coach         | +213555111222   | Coach@2026    |
| Membre        | +213600000000   | Membre@2026   |
