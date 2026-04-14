import express from 'express';
import path from 'path';
import { crawl } from './crawler.ts';

const app = express();
const port = 3000;

app.use(express.static(path.join(process.cwd(), 'src/frontend')));

app.get('/crawl', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});