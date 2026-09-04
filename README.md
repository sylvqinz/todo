## Structure du projet

```
React-TP/
├── back/                 # API Django REST
│   ├── api/              # App principale (models, views, serializers)
│   ├── config/           # Configuration Django (settings, urls)
│   ├── db.sqlite3        # Base de données SQLite
│   ├── manage.py
│   └── requirements.txt
└── front/                # Application React + Vite + TypeScript
    ├── src/
    │   ├── components/   # Composants React (Todo, TaskForm, TaskList, CategoryForm)
    │   ├── services/     # Client API (apiClient.ts)
    │   └── index.css     # Styles Tailwind CSS
    ├── .env              # Variable VITE_API_BASE_URL
    ├── package.json
    └── vite.config.ts
```

## Stack technique

| Couche   | Technologies                                      |
|----------|---------------------------------------------------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4      |
| Backend  | Django 6, Django REST Framework, django-cors-headers |
| Base de données | SQLite                                      |

## Fonctionnalités

- Créer, lister et supprimer des **catégories**
- Créer, lister, compléter et supprimer des **tâches**
- Filtrer les tâches par catégorie via un menu déroulant
- Validation des formulaires avec affichage des erreurs du backend
- Suppression en cascade (supprimer une catégorie supprime ses tâches)

## API REST

| Méthode | Endpoint               | Description                          |
|---------|------------------------|--------------------------------------|
| GET     | /api/categories/       | Liste toutes les catégories          |
| POST    | /api/categories/       | Crée une catégorie                   |
| DELETE  | /api/categories/:id/   | Supprime une catégorie (+ ses tâches)|
| GET     | /api/tasks/            | Liste toutes les tâches              |
| POST    | /api/tasks/            | Crée une tâche                       |
| PATCH   | /api/tasks/:id/        | Met à jour une tâche (ex: compléter) |
| DELETE  | /api/tasks/:id/        | Supprime une tâche                   |

## Installation et lancement

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

python -m venv env
.env/Scripts/activate

Le serveur Django démarre sur `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le serveur Vite démarre sur `http://localhost:5173`.

## Architecture frontend

```
App
└── Todo              # Orchestrateur principal (état global, fetch initial)
    ├── CategoryForm  # Formulaire de création de catégorie
    ├── TaskForm      # Formulaire de création de tâche (avec sélection de catégorie)
    └── TaskList      # Liste des tâches, filtrage par catégorie, toggle/suppression
```

- **Todo** gère l'état centralisé (`categories`, `tasks`) et le transmet aux enfants via props
- **apiClient.ts** centralise toutes les requêtes HTTP avec gestion d'erreurs typée (`ApiError`)
