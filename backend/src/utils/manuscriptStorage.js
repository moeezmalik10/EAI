import path from 'node:path';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import { fileURLToPath } from 'node:url';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

/**
 * Persists an in-memory multer file to Vercel Blob (when
 * BLOB_READ_WRITE_TOKEN is configured — i.e. deployed on Vercel, or a Blob
 * store's token pulled in locally) or to backend/uploads/ otherwise, so a
 * plain `npm run dev` still works without any Blob setup.
 */
export async function saveManuscriptFile(file) {
  if (!file) return undefined;

  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`manuscripts/${unique}`, file.buffer, {
      access: 'private',
      contentType: file.mimetype,
    });
    return {
      originalName: file.originalname,
      storage: 'blob',
      url: blob.url,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  fssync.mkdirSync(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, unique), file.buffer);
  return {
    originalName: file.originalname,
    storage: 'local',
    storedName: unique,
    mimeType: file.mimetype,
    size: file.size,
  };
}
