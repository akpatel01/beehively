# Beehively Backend API

Express + MongoDB service that powers Beehively. Handles posts, authentication, and profile data.

## Project Structure

```
beehively-backend/
  app.js               # Express app bootstrap
  conn/                # Database connection helpers
  controllers/         # Route handlers (auth, posts)
  middleware/          # Shared middleware (auth)
  model/               # Mongoose models
  routes/              # Express routers
```

## Getting Started

```bash
cd beehively-backend
npm install
```

Create `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/beehively
JWT_SECRET=replace-with-strong-secret
```

Start the API:
```bash
npm run dev    # watches for changes (nodemon)
# or
npm start
```

The server listens on `http://localhost:3000`. All routes are prefixed with `/api` (see `app.js`).

## Key Endpoints

- `POST /api/auth/signup` – register
- `POST /api/auth/login` – login and get JWT
- `GET /api/posts/get-posts` – list posts (supports `status` and `author` query params)
- `GET /api/posts/get-post/:id` – single post
- `POST /api/posts/create-post` – create (requires `Authorization: Bearer <token>`)
- `PUT /api/posts/update-post/:id` – update own post
- `DELETE /api/posts/delete-post/:id` – delete own post

## Development Notes

- JWT payload is attached to `req.user` by `middleware/auth.js`.
- Models live in `model/`. Posts are stored with timestamps and author references.
- Update `.env` to match your MongoDB connection before starting the server.
