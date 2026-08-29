import 'dotenv/config';
import { runFullScrape } from './index.js';
import { prisma } from '../config/prisma.js';

const baseUrl = (process.env.SCRAPE_URL || 'https://evjai.com').replace(/\/$/, '');

async function main() {
  await runFullScrape(baseUrl);
  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[scraper] fatal error:', err);
  process.exit(1);
});
