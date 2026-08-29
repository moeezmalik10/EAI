import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';

// Volumes aren't stored as their own table — they're a grouping of Issues by
// volumeNumber, computed here from the Issue rows (see prisma/schema.prisma).
export async function listVolumes(req, res, next) {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: [{ volumeNumber: 'desc' }, { issueNumber: 'desc' }],
      select: {
        id: true,
        title: true,
        series: true,
        issueNumber: true,
        volumeNumber: true,
        year: true,
        dateRange: true,
        coverImage: true,
      },
    });

    const byVolume = new Map();
    for (const issue of issues) {
      if (!byVolume.has(issue.volumeNumber)) {
        byVolume.set(issue.volumeNumber, {
          id: `volume-${issue.volumeNumber}`,
          volumeNumber: issue.volumeNumber,
          year: issue.year,
          issues: [],
        });
      }
      byVolume.get(issue.volumeNumber).issues.push(issue);
    }

    const volumes = [...byVolume.values()].sort((a, b) => b.volumeNumber - a.volumeNumber);
    res.json(withId(volumes));
  } catch (err) {
    next(err);
  }
}
