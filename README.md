# Web Crawler - GCP Cloud Function

A serverless web crawler deployed as a Google Cloud Function that extracts metadata from web pages, classifies them, and identifies relevant topics.

## Features

- HTTP-triggered Cloud Function for crawling URLs
- Extracts title, description, and body text
- Classifies the page type (e.g., Product Page, Article Page)
- Identifies top relevant topics/keywords
- Returns JSON response with crawl results

## Prerequisites

- Google Cloud SDK installed and authenticated
- A GCP project with Cloud Functions API enabled
- Node.js 20

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Deploy to GCP

```bash
npm run deploy
```

This deploys the function with HTTP trigger, allowing unauthenticated access.

## Usage

After deployment, the function URL will be provided. Call it with:

```
GET https://REGION-PROJECT.cloudfunctions.net/crawlFunction?url=https://example.com
```

Response:
```json
{
  "title": "Example Domain",
  "description": "Example description",
  "body": "Body content...",
  "classification": "General Page",
  "topics": ["example", "domain"],
  "links": ["https://example.com/link1", ...]
}
```

## Frontend

A separate React frontend is now available in `src/frontend` and can be deployed independently from the backend.

### Run locally

```bash
cd src/frontend
npm install
npm run dev
```

### Build for production

```bash
cd src/frontend
npm run build
```

### Configure the backend endpoint

The React app uses the `VITE_CRAWL_API_URL` environment variable if set. In development it will proxy `/crawl` to a backend running on `http://localhost:8080`.

Example deployment URL:

```
VITE_CRAWL_API_URL=https://REGION-PROJECT.cloudfunctions.net/crawlFunction
```

Use the built frontend app on any static host or CDN while keeping the backend as a separate Cloud Function.