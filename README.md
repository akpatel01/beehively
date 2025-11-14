# Beehively

A lightweight content publishing platform with separate frontend and backend apps.

## Repos

- `beehively-backend/` – Express + MongoDB API
- `beehively-frontend/` – React + TypeScript client
- `beehively-frontend-router-v7/` – React-router-v7 + TypeScript server


## Quick Start

```bash
# Backend
cd beehively-backend
npm install
npm run dev

# Frontend
cd beehively-frontend
npm install
npm run dev
```

# Frontend router-v7
cd beehively-frontend-router-v7
npm install
npm run dev
```

Backend runs on `http://localhost:3000/api`. Frontend runs on `http://localhost:5173`.

## Feature Overview

- Authentication (signup/login) with JWT-protected authoring routes.
- Publish, edit, soft-delete, and restore posts with tag management.
- Home feed with search, sorting, and quick navigation into detailed post views.
- Public author profiles that list all of a user’s published posts.
- Authenticated profile dashboard for managing your own drafts and published content.