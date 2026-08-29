import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';

export async function listIssues(req, res, next) {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: [{ volumeNumber: 'desc' }, { issueNumber: 'desc' }],
      include: {
        articles: {
          orderBy: { firstPage: 'asc' },
          select: {
            id: true,
            title: true,
            authors: true,
            doi: true,
            publishedDate: true,
            firstPage: true,
            lastPage: true,
          },
        },
      },
    });
    res.json(withId(issues));
  } catch (err) {
    next(err);
  }
}

export async function getIssue(req, res, next) {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.id },
      include: { articles: { orderBy: { firstPage: 'asc' } } },
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(withId(issue));
  } catch (err) {
    next(err);
  }
}
