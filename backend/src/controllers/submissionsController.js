import { prisma } from '../config/prisma.js';
import { withId } from '../utils/serialize.js';
import { saveManuscriptFile } from '../utils/manuscriptStorage.js';

export async function createSubmission(req, res, next) {
  try {
    const { title, abstract, authors, correspondingEmail } = req.body;
    if (!title || !abstract || !authors || !correspondingEmail) {
      return res.status(400).json({
        message: 'title, abstract, authors, and correspondingEmail are required',
      });
    }

    let keywords = [];
    if (req.body.keywords) {
      keywords = Array.isArray(req.body.keywords)
        ? req.body.keywords
        : String(req.body.keywords)
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
    }

    const manuscriptFile = await saveManuscriptFile(req.file);

    const submission = await prisma.submission.create({
      data: {
        title,
        abstract,
        authors,
        correspondingEmail,
        keywords,
        manuscriptFile: manuscriptFile ?? undefined,
      },
    });

    res.status(201).json(
      withId({
        message: 'Submission received successfully. Our editorial team will be in touch shortly.',
        submission,
      })
    );
  } catch (err) {
    next(err);
  }
}
