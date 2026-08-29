import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import Loading from '../components/Loading.jsx';
import FadeIn from '../components/FadeIn.jsx';
import { formatAuthors } from '../utils/format.js';

export default function IssueDetail() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    endpoints
      .issue(id)
      .then((res) => active && setIssue(res.data))
      .catch(() => active && setError('Issue not found.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Loading label="Loading issue…" />;
  if (error || !issue)
    return (
      <div className="container-page py-16">
        <p className="text-red-600">{error || 'Issue not found.'}</p>
        <Link to="/archives" className="mt-4 inline-block text-navy-700 hover:text-gold-500">
          ← Back to Archives
        </Link>
      </div>
    );

  return (
    <div>
      <section className="bg-navy-800 py-14 text-white">
        <div className="container-page">
          <Link to="/archives" className="text-sm text-white/60 hover:text-gold-400">
            ← Archives
          </Link>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">{issue.title}</h1>
          <p className="mt-2 text-white/70">
            {issue.series} {issue.dateRange && `• ${issue.dateRange}`}
          </p>
        </div>
      </section>

      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {issue.coverImage && (
            <FadeIn>
              <img src={issue.coverImage} alt={issue.title} className="w-full rounded-md shadow-md" />
            </FadeIn>
          )}
          <div>
            <h2 className="section-title mb-6">Table of Contents</h2>
            <ul className="divide-y divide-navy-100">
              {issue.articles.map((article, i) => (
                <FadeIn key={article._id} delay={i * 40}>
                  <li className="py-5">
                    <Link
                      to={`/articles/${article._id}`}
                      className="font-serif text-lg font-semibold text-navy-900 hover:text-gold-500"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-1 text-sm text-navy-500">{formatAuthors(article.authors)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-navy-400">
                      {article.firstPage && (
                        <span>
                          pp. {article.firstPage}–{article.lastPage || article.firstPage}
                        </span>
                      )}
                      {article.doi && <span>DOI: {article.doi}</span>}
                      {article.pdfUrl && (
                        <a
                          href={article.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-teal-600 hover:text-teal-800"
                        >
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                </FadeIn>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
