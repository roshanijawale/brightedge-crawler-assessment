# Frontend

This folder contains the React frontend for the web crawler.

## Install

```bash
cd frontend
npm install
```

## Run locally

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Deployment

Deploy the contents of `frontend/dist` to any static host or Vercel.

Set the backend endpoint with `VITE_CRAWL_API_URL`:

```bash
VITE_CRAWL_API_URL=https://YOUR_BACKEND_URL
```

During local development, the app proxies `/crawl` to `http://localhost:8080`.
