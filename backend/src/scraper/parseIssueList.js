import * as cheerio from 'cheerio';

/**
 * Parses an OJS issue archive (or current issue index) page and returns
 * lightweight issue summaries. Works for both /issue/archive and any page
 * that renders one or more .obj_issue_summary blocks.
 */
export function parseIssueList(html, baseUrl) {
  const $ = cheerio.load(html);
  const issues = [];

  $('.obj_issue_summary').each((_, el) => {
    const node = $(el);
    const link = node.find('h2 a.title, a.title').first();
    const href = link.attr('href') || node.find('a.cover').attr('href') || '';
    const idMatch = href.match(/issue\/view\/(\d+)/);
    if (!idMatch) return;

    const title = link.text().trim().replace(/\s+/g, ' ');
    const series = node.find('.series').text().trim().replace(/\s+/g, ' ');
    const description = node.find('.description').text().trim().replace(/\s+/g, ' ');
    const coverImage = node.find('a.cover img').attr('src') || '';

    // series looks like "Vol. 3 No. 2 (2026)"
    const seriesMatch = series.match(/Vol\.?\s*(\d+)\s*No\.?\s*(\d+)\s*\((\d+)\)/i);

    issues.push({
      ojsIssueId: idMatch[1],
      sourceUrl: href.startsWith('http') ? href : new URL(href, baseUrl).toString(),
      title,
      series,
      dateRange: description,
      coverImage,
      volumeNumber: seriesMatch ? Number(seriesMatch[1]) : null,
      issueNumber: seriesMatch ? Number(seriesMatch[2]) : null,
      year: seriesMatch ? Number(seriesMatch[3]) : null,
    });
  });

  return issues;
}

/** Extracts the article/view links listed on an issue's table-of-contents page. */
export function parseIssueArticleLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = [];

  $('.obj_article_summary h3.title a, .obj_article_summary .article__title a').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    const idMatch = href.match(/article\/view\/(\d+)/);
    if (!idMatch) return;
    links.push({
      ojsArticleId: idMatch[1],
      sourceUrl: href.startsWith('http') ? href : new URL(href, baseUrl).toString(),
    });
  });

  return links;
}
