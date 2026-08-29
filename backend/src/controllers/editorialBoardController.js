import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';

const ROLE_ORDER = { 'Chief Editor': 0, 'Managing Editor': 1, 'Editorial Board': 2, 'Advisory Board': 3 };

export async function listEditorialBoard(req, res, next) {
  try {
    const members = await prisma.editorialBoardMember.findMany({ orderBy: { order: 'asc' } });
    members.sort((a, b) => (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9) || a.order - b.order);
    res.json(withId(members));
  } catch (err) {
    next(err);
  }
}
