import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import Loading from '../components/Loading.jsx';
import FadeIn from '../components/FadeIn.jsx';
import { formatDate, formatDoiUrl } from '../utils/format.js';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    endpoints
      .article(id)
      .then((res) => active && setArticle(res.data))
      .catch(() => active && setError('Article not found.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Loading label="Loading article…" />;
  if (error || !article)
    return (
      <div className="container-page py-16">
        <p className="text-red-600">{error || 'Article not found.'}</p>
        <Link to="/articles" className="mt-4 inline-block text-navy-700 hover:text-gold-500">
          ← Back to Articles
        </Link>
      </div>
    );

  const doiUrl = formatDoiUrl(article.doi);

  return (
    <div>
      <section className="bg-navy-800 py-14 text-white">
        <div className="container-page">
          <Link to="/articles" className="text-sm text-white/60 hover:text-gold-400">
            ← All Articles
          </Link>
          <h1 className="mt-3 max-w-4xl font-serif text-2xl font-bold leading-snug sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-3 text-white/70">
            {article.authors?.map((a) => a.name).join(', ')}
          </p>
        </div>
      </section>

      <div className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          <FadeIn>
            <div>
              <h2 className="mb-3 font-serif text-xl font-bold text-navy-900">Abstract</h2>
              <p className="mb-8 leading-relaxed text-navy-600">
                {article.abstract || 'No abstract available.'}
              </p>

              {article.keywords?.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-navy-900">Authors</h3>
                <ul className="space-y-1 text-sm text-navy-600">
                  {article.authors?.map((a) => (
                    <li key={a.name}>
                      <span className="font-medium text-navy-800">{a.name}</span>
                      {a.affiliation && <span> — {a.affiliation}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <aside className="card space-y-4 p-6">
              {article.pdfUrl && (
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full"
                >
                  Download PDF
                </a>
              )}

              <dl className="space-y-3 text-sm">
                <Detail label="Published" value={formatDate(article.publishedDate)} />
                {article.issue && (
                  <Detail
                    label="Issue"
                    value={
                      <Link to={`/issues/${article.issue._id}`} className="text-navy-700 hover:text-gold-500">
                        {article.issue.series || article.issue.title}
                      </Link>
                    }
                  />
                )}
                {article.volumeNumber && <Detail label="Volume" value={article.volumeNumber} />}
                {article.issueNumber && <Detail label="Issue No." value={article.issueNumber} />}
                {article.firstPage && (
                  <Detail label="Pages" value={`${article.firstPage}–${article.lastPage || article.firstPage}`} />
                )}
                {article.section && <Detail label="Section" value={article.section} />}
                {article.doi && (
                  <Detail
                    label="DOI"
                    value={
                      <a href={doiUrl} target="_blank" rel="noreferrer" className="text-navy-700 hover:text-gold-500">
                        {article.doi}
                      </a>
                    }
                  />
                )}
              </dl>
            </aside>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy-50 pb-2">
      <dt className="text-navy-500">{label}</dt>
      <dd className="text-right font-medium text-navy-800">{value}</dd>
    </div>
  );
}
