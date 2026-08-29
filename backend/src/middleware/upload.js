import multer from 'multer';

// Buffered in memory, then handed to saveManuscriptFile() (see
// utils/manuscriptStorage.js), which persists to Vercel Blob when
// available or falls back to local disk for plain local development.
// Vercel's function filesystem is read-only (aside from /tmp, which
// doesn't survive between invocations), so disk storage can't be the
// primary path once deployed.
const storage = multer.memoryStorage();

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF or Word manuscript files are accepted'));
  },
});
