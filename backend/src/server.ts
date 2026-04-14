(global as any).File = class File {};
import express from 'express';
import { crawl } from './crawler.ts';

const expressApp = express();
export const app = expressApp;
const port = process.env.PORT || 8080;

expressApp.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  next();
});

app.get('/', (req, res) => {
  res.json({ status: 'crawler backend running' });
});

app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

expressApp.get('/crawl', async (req, res) => {
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    const result = await crawl(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  expressApp.listen(Number(port), '0.0.0.0', () => {
    console.log(`Local server running on port ${port}`);
  });
}