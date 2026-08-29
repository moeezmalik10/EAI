import { fetchHtml } from './httpClient.js';
import { parseIssueList, parseIssueArticleLinks } from './parseIssueList.js';
import { parseArticleDetail } from './parseArticle.js';
import { parseEditorialBoard } from './parseEditorialBoard.js';
import { prisma } from '../config/prisma.js';

const JOURNAL_PATH = '/index.php/evjai';

function log(...args) {
  console.log('[scraper]', ...args);
}

async function upsertAuthor(author) {
  if (!author.name) return;
  const existing = await prisma.author.findUnique({ where: { name: author.name } });
  const affiliations = new Set(existing?.affiliations || []);
  if (author.affiliation) affiliations.add(author.affiliation);

  if (existing) {
    await prisma.author.update({
      where: { name: author.name },
      data: { affiliations: [...affiliations] },
    });
  } else {
    await prisma.author.create({
      data: { name: author.name, affiliations: [...affiliations] },
    });
  }
}

async function upsertArticle(baseUrl, { ojsArticleId, sourceUrl }, issueRecord) {
  const existing = await prisma.article.findUnique({ where: { ojsArticleId } });
  if (existing) {
    log(`article ${ojsArticleId} already present, skipping fetch`);
    return existing;
  }

  const html = await fetchHtml(sourceUrl);
  const parsed = parseArticleDetail(html, sourceUrl, ojsArticleId);

  const data = {
    title: parsed.title,
    authors: parsed.authors,
    abstract: parsed.abstract,
    keywords: parsed.keywords,
    volumeNumber: parsed.volumeNumber ?? issueRecord?.volumeNumber,
    issueNumber: parsed.issueNumber ?? issueRecord?.issueNumber,
    year: parsed.year ?? issueRecord?.year,
    firstPage: parsed.firstPage,
    lastPage: parsed.lastPage,
    doi: parsed.doi,
    section: parsed.section,
    publishedDate: parsed.publishedDate,
    pdfUrl: parsed.pdfUrl,
    sourceUrl: parsed.sourceUrl,
    issueId: issueRecord?.id,
  };

  const doc = await prisma.article.upsert({
    where: { ojsArticleId },
    create: { ojsArticleId, ...data },
    update: data,
  });

  log(`saved article: ${doc.title}`);

  for (const author of parsed.authors) {
    await upsertAuthor(author);
  }

  return doc;
}

async function upsertIssueAndArticles(baseUrl, issueSummary) {
  const { ojsIssueId, ...rest } = issueSummary;
  const issueRecord = await prisma.issue.upsert({
    where: { ojsIssueId },
    create: { ojsIssueId, ...rest },
    update: rest,
  });
  log(`saved issue: ${issueRecord.title} (${issueRecord.series})`);

  const html = await fetchHtml(issueSummary.sourceUrl);
  const articleLinks = parseIssueArticleLinks(html, baseUrl);
  log(`  found ${articleLinks.length} article(s) in issue ${issueRecord.series || issueRecord.title}`);

  for (const link of articleLinks) {
    await upsertArticle(baseUrl, link, issueRecord);
  }

  return issueRecord;
}

export async function scrapeEditorialBoard(baseUrl) {
  const url = `${baseUrl}${JOURNAL_PATH}/editorial-board`;
  log(`fetching editorial board: ${url}`);
  const html = await fetchHtml(url);
  const members = parseEditorialBoard(html);

  // The Advisory Board lives on a separate page with no shared IDs against
  // the Editorial Board. It's optional — if the page is unreachable, or its
  // content can't be parsed, we still keep the Editorial Board data.
  try {
    const advisoryUrl = `${baseUrl}${JOURNAL_PATH}/advisory-board`;
    log(`fetching advisory board: ${advisoryUrl}`);
    const advisoryHtml = await fetchHtml(advisoryUrl);
    const advisoryMembers = parseEditorialBoard(advisoryHtml, { defaultRole: 'Advisory Board' })
      .filter((m) => m.role === 'Advisory Board');
    let order = members.length;
    for (const m of advisoryMembers) {
      order += 1;
      members.push({ ...m, order });
    }
    log(`found ${advisoryMembers.length} advisory board member(s)`);
  } catch (err) {
    log(`could not fetch/parse advisory board, skipping: ${err.message}`);
  }

  // Board membership is refreshed wholesale each run (small dataset, and the
  // source page has no stable per-member ID to upsert against).
  await prisma.editorialBoardMember.deleteMany({});
  if (members.length) {
    await prisma.editorialBoardMember.createMany({
      data: members.map((m) => ({
        name: m.name,
        role: m.role,
        affiliation: m.affiliation,
        country: m.country,
        email: m.email,
        links: m.links,
        order: m.order,
      })),
    });
  }
  log(`saved ${members.length} editorial board member(s)`);
  return members;
}

export async function scrapeAllIssues(baseUrl) {
  const archiveUrl = `${baseUrl}${JOURNAL_PATH}/issue/archive`;
  const currentUrl = `${baseUrl}${JOURNAL_PATH}/issue/current`;

  log(`fetching archive: ${archiveUrl}`);
  const archiveHtml = await fetchHtml(archiveUrl);
  const archiveIssues = parseIssueList(archiveHtml, baseUrl);

  log(`fetching current issue index: ${currentUrl}`);
  const currentHtml = await fetchHtml(currentUrl);
  const currentIssues = parseIssueList(currentHtml, baseUrl);

  const byId = new Map();
  [...archiveIssues, ...currentIssues].forEach((issue) => byId.set(issue.ojsIssueId, issue));
  const allIssues = [...byId.values()];

  log(`found ${allIssues.length} unique issue(s) across archive + current`);

  for (const issueSummary of allIssues) {
    await upsertIssueAndArticles(baseUrl, issueSummary);
  }

  return allIssues.length;
}

export async function runFullScrape(baseUrl) {
  const start = Date.now();
  log(`starting full scrape of ${baseUrl}`);
  const issueCount = await scrapeAllIssues(baseUrl);
  const members = await scrapeEditorialBoard(baseUrl);
  const seconds = ((Date.now() - start) / 1000).toFixed(1);
  log(`done in ${seconds}s — ${issueCount} issues, ${members.length} board members`);
  return { issueCount, boardMemberCount: members.length };
}
