# Todo List React + Django

Application de gestion de tâches par catégories, composée d'un frontend React et d'une API REST Django.

## Stack technique

| Couche | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4 |
| Backend | Django 6, Django REST Framework, Gunicorn, WhiteNoise |
| Base de données | SQLite en local, PostgreSQL Supabase en production |
| Déploiement | Vercel (frontend), Render (backend) |
| Monitoring | Render Health Check, UptimeRobot, Sentry |

## Structure

```text
React-Django/
├── backend/              # API Django REST
│   ├── api/              # Modèles, sérialiseurs, vues et routes API
│   ├── config/           # URLs et settings development/production
│   ├── manage.py
│   └── requirements.txt
└── frontend/             # Application React + Vite
    ├── public/
    ├── src/
    │   ├── components/   # Todo, formulaires et liste des tâches
    │   └── services/     # Client API typé
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

## Fonctionnalités

- Créer, afficher et supprimer des catégories
- Créer, afficher, terminer et supprimer des tâches
- Filtrer les tâches par catégorie
- Afficher les erreurs de validation renvoyées par l'API
- Supprimer en cascade les tâches d'une catégorie

## Installation locale

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Le backend local utilise SQLite et répond sur `http://localhost:8000`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Le frontend répond par défaut sur `http://localhost:5173`.

Variables locales dans `frontend/.env` :

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SENTRY_DSN=
```

Les fichiers `.env` sont ignorés par Git. Seuls les fichiers `.env.example`, sans secret, doivent être versionnés.

## API REST

| Méthode | Endpoint | Description |
| --- | --- | --- |
| GET, POST | `/api/categories/` | Lister ou créer les catégories |
| DELETE | `/api/categories/:id/` | Supprimer une catégorie et ses tâches |
| GET, POST | `/api/tasks/` | Lister ou créer les tâches |
| PATCH, DELETE | `/api/tasks/:id/` | Modifier ou supprimer une tâche |
| GET | `/health/` | Vérifier la disponibilité du backend |

## Déploiement

### Render

Variables d'environnement du backend :

```env
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=...
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=votre-api.onrender.com
CORS_ALLOWED_ORIGINS=https://votre-frontend.vercel.app
SENTRY_DSN=...
```

Commandes recommandées :

```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
gunicorn config.wsgi:application
```

Le Health Check Render et UptimeRobot peuvent utiliser `/health/`.

### Vercel

Variables d'environnement du frontend :

```env
VITE_API_BASE_URL=https://votre-api.onrender.com/api
VITE_SENTRY_DSN=...
```

Pour envoyer les source maps à Sentry pendant le build, ajouter également `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` et `SENTRY_PROJECT` dans Vercel.

## Qualité

```bash
cd frontend
npm run lint
npm run build
npm audit

cd ../backend
python manage.py check
```

Les routes et composants qui provoquent volontairement une erreur Sentry (`/error/` et `TestComponent`) sont destinés uniquement à la validation du monitoring et doivent être retirés après les captures de preuve.
