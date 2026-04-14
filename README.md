# Web Crawler

This repository is now split into two independent deployable applications:

- `backend/` — the Node.js backend service
- `frontend/` — the React frontend application

## Backend

The backend is an Express-based crawler service that exposes:

- `GET /health`
- `GET /crawl?url=...`

To run backend locally:

```bash
cd backend
npm install
npm run build
npm start
```

## Frontend

The frontend is a React + Vite app and can be deployed separately on Vercel, Netlify, or any static host.

To run frontend locally:

```bash
cd frontend
npm install
npm run dev
```

To build for production:

```bash
cd frontend
npm run build
```

The frontend reads the backend endpoint from `VITE_CRAWL_API_URL`.

For example:

```bash
VITE_CRAWL_API_URL=https://YOUR_BACKEND_URL
```

In local development, the React app proxies `/crawl` to `http://localhost:8080`.

## Folder structure

- `backend/` — backend code, server, Dockerfile, gcloud ignore file
- `frontend/` — React frontend source, Vite config, and build scripts

## Notes

The previous root-level package and TypeScript config files have been removed to keep the frontend and backend independent.
