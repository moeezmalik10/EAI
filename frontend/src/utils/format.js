export function formatAuthors(authors = []) {
  if (!authors.length) return 'Unknown author';
  return authors.map((a) => a.name).join(', ');
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Date unavailable';
  const date = new Date(dateStr);
  if (Number.isNaN(date.valueOf())) return 'Date unavailable';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDoiUrl(doi) {
  if (!doi) return '';
  return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
}
