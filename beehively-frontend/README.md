# Beehively Frontend

React + TypeScript single-page app for Beehively. Built with Vite and Tailwind.

## Project Structure

```
src/
  components/      # Shared UI components
  pages/           # Route-level pages (Home, Profile, etc.)
  services/        # API clients
  App.tsx          # Routes and layout shell
  main.tsx         # App bootstrap
```

## Getting Started

```bash
cd beehively-frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. The app expects the backend at `http://localhost:3000/api` unless `API_URL` is set.

## Core Features

- Browse published posts on the Home page with search and sorting controls.
- View full post details, including tags and author metadata.
- Click an author name to open their public profile and see all of their published posts.
- Sign up, log in, and manage your own posts (create, edit, delete, restore) from the Profile dashboard.
- Create new posts with status and tag management from the editor.

## Available Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run lint` – run eslint

## Environment

Create `.env` (or `.env.local`) if you need to override defaults:

```
API_URL=http://localhost:3000/api
```

## Authentication Notes

Authentication tokens are stored in `localStorage`/`sessionStorage` and added to requests by `src/services/apiClient.ts`.
