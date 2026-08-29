import { Link } from 'react-router-dom';
import { formatAuthors, formatDate } from '../utils/format.js';

export default function ArticleCard({ article }) {
  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-600">
        {article.volumeNumber && (
          <span>
            Vol. {article.volumeNumber}
            {article.issueNumber ? `, No. ${article.issueNumber}` : ''}
          </span>
        )}
        {article.publishedDate && (
          <>
            <span className="text-navy-200">•</span>
            <span className="text-navy-400">{formatDate(article.publishedDate)}</span>
          </>
        )}
      </div>

      <h3 className="font-serif text-lg font-semibold leading-snug text-navy-900">
        <Link to={`/articles/${article._id}`} className="hover:text-navy-600">
          {article.title}
        </Link>
      </h3>

      <p className="text-sm text-navy-500">{formatAuthors(article.authors)}</p>

      {article.abstract && (
        <p className="line-clamp-3 text-sm text-navy-600">{article.abstract}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <Link
          to={`/articles/${article._id}`}
          className="text-sm font-semibold text-navy-700 hover:text-gold-500"
        >
          Read more →
        </Link>
        {article.pdfUrl && (
          <a
            href={article.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-teal-600 hover:text-teal-800"
          >
            PDF
          </a>
        )}
      </div>
    </article>
  );
}
