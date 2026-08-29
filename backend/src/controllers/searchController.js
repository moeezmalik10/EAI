import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';

export async function searchArticles(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ items: [], total: 0, query: q });

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Match articles containing every word of the query, in any order/field,
    // rather than requiring the whole query as one exact contiguous phrase.
    const tokens = q.split(/\s+/).filter(Boolean).slice(0, 10);
    const tokenClauses = tokens.map((token) => {
      const pattern = `%${token}%`;
      return Prisma.sql`(
        title ILIKE ${pattern}
        OR abstract ILIKE ${pattern}
        OR authors::text ILIKE ${pattern}
        OR EXISTS (SELECT 1 FROM unnest(keywords) k WHERE k ILIKE ${pattern})
      )`;
    });

    const whereSql = Prisma.sql`WHERE ${Prisma.join(tokenClauses, ' AND ')}`;

    const [items, totalRows] = await Promise.all([
      prisma.$queryRaw(Prisma.sql`
        SELECT * FROM "Article"
        ${whereSql}
        ORDER BY "publishedDate" DESC NULLS LAST
        LIMIT ${limit} OFFSET ${skip}
      `),
      prisma.$queryRaw(Prisma.sql`SELECT COUNT(*)::int AS count FROM "Article" ${whereSql}`),
    ]);

    const total = Number(totalRows[0]?.count || 0);

    res.json(
      withId({
        items,
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        query: q,
      })
    );
  } catch (err) {
    next(err);
  }
}
