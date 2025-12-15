# Concours Hanoukiot 5786

Application web pour un concours de hanoukiot avec système de vote.

## 📋 Description

Cette application permet de:
- 🏛️ **Admin**: Ajouter des hanoukiot avec images, gérer l'ordre d'affichage, voir les statistiques
- 👥 **Visiteurs**: Voir toutes les hanoukiot et voter (note de 1 à 10)
- 📊 Suivre les votes en temps réel avec statistiques détaillées

## 🏗️ Architecture

### Backend
- **Node.js + Express** - API REST
- **Multer** - Upload d'images
- **JSON** - Base de données fichier
- **Structure**:
  - `routes/` - Définition des endpoints
  - `controllers/` - Logique métier
  - `services/` - Accès aux données
  - `helpers/` - Fonctions utilitaires
  - `uploads/` - Stockage des images

### Frontend
- **React 18 + Vite** - Interface utilisateur
- **React Router** - Navigation
- **@dnd-kit** - Drag & drop pour réorganiser
- **Context API** - Gestion d'état
- **Structure modulaire**: Tous les fichiers ≤100 lignes

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Backend
```bash
cd backend
npm install
node server.js
```
Le serveur démarre sur `http://localhost:3000`

### Frontend
```bash
npm install
npm run dev
```
L'application démarre sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine:
```
VITE_API_URL=http://localhost:3000/api
```

### Code administrateur

Le code admin par défaut est `default-code-5786`.  
Pour le modifier, éditez `backend/data/db.json`:
```json
{
  "adminCode": "votre-nouveau-code",
  ...
}
```

## 📂 Structure du projet

```
├── backend/               # Serveur Node.js
│   ├── controllers/      # Logique métier (≤100 lignes)
│   ├── helpers/          # Fonctions utilitaires
│   ├── middleware/       # Configuration Multer
│   ├── routes/           # Endpoints API
│   ├── services/         # Accès base de données
│   ├── uploads/          # Images uploadées
│   ├── data/
│   │   └── db.json       # Base de données JSON
│   └── server.js         # Point d'entrée
│
├── src/                  # Frontend React
│   ├── components/
│   │   ├── admin/        # Composants admin (≤100 lignes)
│   │   ├── visitor/      # Composants visiteurs
│   │   └── shared/       # Composants partagés
│   ├── context/          # Context API
│   ├── hooks/            # Custom hooks
│   ├── services/         # API client
│   └── utils/            # Constantes
│
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Hanoukiot
- `GET /api/hanoukiot` - Liste toutes les hanoukiot avec votes
- `POST /api/hanoukiot` - Ajouter une hanoukia (admin)
- `PUT /api/hanoukiot/reorder` - Réorganiser (admin)
- `DELETE /api/hanoukiot/:id` - Supprimer (admin)
- `GET /api/hanoukiot/statistics` - Statistiques (admin)

### Votes
- `POST /api/votes` - Soumettre/modifier un vote
- `GET /api/votes/:hanoukiaId/:voterId` - Vote d'un utilisateur
- `GET /api/votes/user/:voterId` - Tous les votes d'un utilisateur

### Admin
- `POST /api/admin/verify` - Vérifier code admin
- `GET /api/admin/health` - Santé du serveur

## 📝 Notes de développement

### Contraintes
- **100 lignes maximum** par fichier
- **Séparation Backend/Frontend** stricte
- **Modularité**: Composants réutilisables
- **Pas de base de données externe**: JSON file-based

### Bonnes pratiques
- Tous les fichiers suivent le pattern MVC
- Helpers pour la logique réutilisable
- Custom hooks pour l'état React
- Validation côté serveur

## 🔐 Sécurité

- Code administrateur requis pour toutes les opérations admin
- Validation des fichiers uploadés (taille, type)
- Sanitization des inputs
- CORS configuré

## 📄 License

Projet privé - Concours Hanoukiot 5786
