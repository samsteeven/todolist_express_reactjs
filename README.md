# Projet TodoList App

Application de gestion de tâches avec une architecture frontend/backend séparée.

## Structure du projet

- **`backend/`** : API REST développée avec Express et MongoDB
- **`todolist-app/`** : Application frontend React

## Prérequis

- Node.js (v18+)
- npm ou yarn
- MongoDB (installé localement ou accès à une instance distante)

## Installation

### Backend

```bash
cd backend
npm install
```

Créez un fichier à la racine du dossier backend avec les variables suivantes: `.env`
``` 
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=votre_secret_jwt
```
### Frontend
``` bash
cd todolist-app
npm install
```
## Démarrage
### Backend
``` bash
cd backend
npm run dev
```
Le serveur démarre sur [http://localhost:5000](http://localhost:5000)

### Frontend
``` bash
cd todolist-app
npm run dev
```
L'application est accessible sur [http://localhost:5173](http://localhost:5173)
## Fonctionnalités
- Création de compte et authentification
- Gestion des tâches (création, modification, suppression)
- Catégorisation des tâches
- Filtrage et recherche

## Technologies utilisées
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : React, Zustand, TailwindCSS
- **Outils** : TypeScript, ESLint, Vite
