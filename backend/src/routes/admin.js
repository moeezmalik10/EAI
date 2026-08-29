import { Router } from 'express';
import { runFullScrape } from '../scraper/index.js';

const router = Router();

// Convenience endpoint so the prototype can be (re)seeded from the running
// server without dropping to a terminal. Not authenticated — prototype only.
router.post('/scrape', async (req, res, next) => {
  try {
    const baseUrl = (process.env.SCRAPE_URL || 'https://evjai.com').replace(/\/$/, '');
    const result = await runFullScrape(baseUrl);
    res.json({ message: 'Scrape complete', ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
