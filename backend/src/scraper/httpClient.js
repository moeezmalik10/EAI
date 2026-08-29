import axios from 'axios';

const client = axios.create({
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 EVJAI-Prototype-Scraper/1.0',
  },
  timeout: 20000,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchHtml(url, { retries = 2, politeDelayMs = 300 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const { data } = await client.get(url);
      await delay(politeDelayMs);
      return data;
    } catch (err) {
      lastError = err;
      await delay(500 * (attempt + 1));
    }
  }
  throw lastError;
}
