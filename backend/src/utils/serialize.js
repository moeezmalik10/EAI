/**
 * Prisma's client field is `id` (Prisma's schema DSL rejects a leading
 * underscore), but the frontend — and the original Mongoose-backed API it
 * was built against — expects `_id` everywhere, including on nested
 * relations (article.issue._id, issue.articles[]._id, ...). This walks any
 * Prisma result (object, array, or nested combination) and renames every
 * `id` key to `_id`, so the rest of the app never has to change.
 */
export function withId(value) {
  if (Array.isArray(value)) return value.map(withId);
  if (value instanceof Date) return value;
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, v] of Object.entries(value)) {
      if (key === 'id') out._id = withId(v);
      else out[key] = withId(v);
    }
    return out;
  }
  return value;
}
