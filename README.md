# Real-Time Shared Grid

A full-stack real-time grid application where users can claim tiles, see updates instantly across clients, and reset their own captured tiles.

## Project Structure

```text
grid/
├── client/                     # Vite + React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── .env
├── server/                     # Express + Socket.IO + PostgreSQL + Redis backend
│   ├── src/
│   │   ├── services/
│   │   ├── db.ts
│   │   ├── server.ts
│   │   ├── socket.ts
│   │   ├── migrate.ts
│   │   └── migrateuser.ts
│   ├── test/
│   ├── package.json
│   └── .env
└── README.md
```

## Tech Stack

- Frontend: React, TypeScript, Vite, Zustand, Socket.IO Client, Tailwind CSS
- Backend: Node.js, TypeScript, Express, Socket.IO, PostgreSQL, Redis
- Deployment: Vercel (frontend), Render (backend)

## Installation and Local Development

### 1. Clone

```bash
git clone <your-repo-url>
cd grid
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create or update `server/.env`:

```env
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/grid
FRONTEND_URL=http://localhost:5173
PG_SSL=false
PG_SSL_REJECT_UNAUTHORIZED=true
PG_USE_LIBPQ_COMPAT=false

REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_URL=redis://default:<password>@<host>:<port>
# REDIS_USERNAME=default
# REDIS_PASSWORD=
REDIS_TLS=false
```

Run migrations:

```bash
node --loader ts-node/esm src/migrate.ts
node --loader ts-node/esm src/migrateuser.ts
```

Start backend:

```bash
npm run dev
```

Backend runs on `http://localhost:3000` by default.

### 3. Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create or update `client/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Scripts

### Server (`server/package.json`)

- `npm run dev` - Start backend with ts-node
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled backend (`src/server.js`)
- `npm run db:migrate` - DB connectivity test script

### Client (`client/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build

## API Summary

### REST

- `GET /health`
- `GET /api/tiles`
- `GET /api/stats`
- `POST /api/users`
- `POST /api/reset/:userId`

### Socket Events

Client to Server:
- `capture_tile` `{ tileId, userId }`

Server to Client:
- `grid_state`
- `tile_updated`
- `capture_failed`

## Deployment Notes

### Frontend (Vercel)

- Root Directory: `client`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Set env vars in Vercel:

```env
VITE_API_URL=https://<your-backend>.onrender.com
VITE_SOCKET_URL=https://<your-backend>.onrender.com
```

### Backend (Render)

- Root Directory: `server`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

Set backend CORS env:

```env
FRONTEND_URL=https://<your-frontend>.vercel.app
# optional multiple origins
FRONTEND_ORIGIN=https://<your-frontend>.vercel.app,https://<your-preview>.vercel.app
```

## Troubleshooting

### CORS error on Socket.IO polling

If browser shows blocked request on `/socket.io`:

1. Ensure frontend points to deployed backend (not localhost)
2. Ensure backend includes current frontend domain in `FRONTEND_URL`/`FRONTEND_ORIGIN`
3. Redeploy backend after env var updates

### Redis connection errors

- `ECONNREFUSED`: wrong host/port or Redis not running
- `ERR_SSL_WRONG_VERSION_NUMBER`: `REDIS_TLS` mismatch with provider

### Postgres SSL errors

For managed DBs with strict cert chains:

```env
PG_SSL=true
PG_SSL_REJECT_UNAUTHORIZED=false
PG_USE_LIBPQ_COMPAT=true
```
