# Backend

This folder contains the backend service for the web crawler.

## Install

```bash
cd backend
npm install
```

## Run locally

```bash
npm run build
npm start
```

## Build

```bash
npm run build
```

The backend exposes:
- `GET /health`
- `GET /crawl?url=...`

Use `npm run dev` to build and run the backend locally in one command.
