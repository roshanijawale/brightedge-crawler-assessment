# Web Crawler

A TypeScript-based web crawler with a frontend interface that extracts metadata from web pages, classifies them, and identifies relevant topics.

## Features

- Web interface to input URLs
- Fetches HTML content from a given URL
- Extracts title, description, and body text
- Classifies the page type (e.g., Product Page, Article Page)
- Identifies top relevant topics/keywords
- Displays results on the same page

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

Open `http://localhost:3000` in your browser.

## Usage

Enter a URL in the input field and click "Crawl" to see the results displayed below.

## Example

For the Amazon toaster page, it will show the title, description, classification as "Product Page", and topics like "toaster", "amazon", etc.