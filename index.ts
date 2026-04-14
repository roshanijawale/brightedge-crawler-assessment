import { Request, Response } from 'express';
import { crawl } from './src/backend/crawler.js';

export const crawlFunction = async (req: Request, res: Response) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const url = req.query.url as string;
  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const result = await crawl(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};