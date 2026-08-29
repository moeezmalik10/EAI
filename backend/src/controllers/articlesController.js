import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';

async function attachIssues(articles) {
  const issueIds = [...new Set(articles.map((a) => a.issueId).filter(Boolean))];
  if (!issueIds.length) return articles.map((a) => ({ ...a, issue: null }));

  const issues = await prisma.issue.findMany({
    where: { id: { in: issueIds } },
    select: { id: true, title: true, series: true, volumeNumber: true, issueNumber: true },
  });
  const issueById = new Map(issues.map((i) => [i.id, i]));
  return articles.map((a) => ({ ...a, issue: a.issueId ? issueById.get(a.issueId) || null : null }));
}

export async function listArticles(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const { volume, issue, year, search } = req.query;
    const skip = (page - 1) * limit;

    const conditions = [];
    if (volume) conditions.push(Prisma.sql`"volumeNumber" = ${Number(volume)}`);
    if (issue) conditions.push(Prisma.sql`"issueNumber" = ${Number(issue)}`);
    if (year) conditions.push(Prisma.sql`"year" = ${Number(year)}`);
    if (search) {
      const pattern = `%${String(search)}%`;
      conditions.push(Prisma.sql`(
        title ILIKE ${pattern}
        OR abstract ILIKE ${pattern}
        OR authors::text ILIKE ${pattern}
        OR EXISTS (SELECT 1 FROM unnest(keywords) k WHERE k ILIKE ${pattern})
      )`);
    }

    const whereSql = conditions.length
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

    const [items, totalRows] = await Promise.all([
      prisma.$queryRaw(Prisma.sql`
        SELECT * FROM "Article"
        ${whereSql}
        ORDER BY "publishedDate" DESC NULLS LAST, "createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `),
      prisma.$queryRaw(Prisma.sql`SELECT COUNT(*)::int AS count FROM "Article" ${whereSql}`),
    ]);

    const itemsWithIssue = await attachIssues(items);
    const total = Number(totalRows[0]?.count || 0);

    res.json(
      withId({
        items: itemsWithIssue,
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      })
    );
  } catch (err) {
    next(err);
  }
}

export async function getArticle(req, res, next) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: {
        issue: {
          select: {
            id: true,
            title: true,
            series: true,
            volumeNumber: true,
            issueNumber: true,
            coverImage: true,
          },
        },
      },
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(withId(article));
  } catch (err) {
    next(err);
  }
}
