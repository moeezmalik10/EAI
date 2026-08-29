import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import ArticleCard from '../components/ArticleCard.jsx';
import Loading from '../components/Loading.jsx';
import FadeIn from '../components/FadeIn.jsx';
import { formatAuthors } from '../utils/format.js';

const METRICS = [
  { label: 'Editorial Board Members', value: '11+' },
  { label: 'Countries Represented', value: '8+' },
  { label: 'Published Papers', value: '40+' },
  { label: 'Avg. Time to First Decision', value: '20 days' },
];

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([endpoints.issues(), endpoints.articles({ limit: 6 })])
      .then(([issuesRes, articlesRes]) => {
        if (!active) return;
        setIssues(issuesRes.data);
        setArticles(articlesRes.data.items || []);
      })
      .catch(() => active && setError('Could not load journal data. Is the backend running and seeded?'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const currentIssue = issues[0];

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(214,155,30,0.18),_transparent_55%)]" />
        <div className="container-page relative flex flex-col gap-6 py-20 sm:py-28">
          <FadeIn>
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-300">
              Peer-Reviewed &middot; Open Access &middot; Quarterly
            </span>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Euro Vantage Journal of Artificial Intelligence
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="max-w-2xl text-lg text-white/75">
              Advancing rigorous, high-impact research in machine learning, deep learning, and
              AI ethics — connecting scholars and practitioners across the global AI community.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/archives" className="btn-gold">
                Browse Archives
              </Link>
              <Link
                to="/submit"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2"
              >
                Submit Your Paper
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-b border-navy-100 bg-navy-50">
        <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {METRICS.map((m) => (
            <FadeIn key={m.label} className="text-center">
              <p className="font-serif text-3xl font-bold text-navy-800">{m.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-navy-500">
                {m.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      <div className="container-page py-16">
        {loading && <Loading label="Loading journal highlights…" />}
        {error && !loading && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {!loading && !error && (
          <>
            {currentIssue && (
              <FadeIn className="mb-16 grid grid-cols-1 gap-8 rounded-xl border border-navy-100 bg-white p-6 shadow-sm lg:grid-cols-[220px_1fr]">
                <div className="flex justify-center lg:justify-start">
                  {currentIssue.coverImage ? (
                    <img
                      src={currentIssue.coverImage}
                      alt={currentIssue.title}
                      className="h-64 w-48 rounded-md object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-64 w-48 items-center justify-center rounded-md bg-navy-100 text-navy-400">
                      No cover
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                    Current Issue
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-navy-900">
                    {currentIssue.series || currentIssue.title}
                  </h2>
                  <p className="mt-1 text-sm text-navy-500">{currentIssue.dateRange}</p>
                  <ul className="mt-4 space-y-2">
                    {(currentIssue.articles || []).slice(0, 4).map((a) => (
                      <li key={a._id} className="text-sm">
                        <Link to={`/articles/${a._id}`} className="font-medium text-navy-800 hover:text-gold-500">
                          {a.title}
                        </Link>
                        <span className="block text-navy-400">{formatAuthors(a.authors)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/issues/${currentIssue._id}`}
                    className="mt-5 inline-block text-sm font-semibold text-navy-700 hover:text-gold-500"
                  >
                    View full issue →
                  </Link>
                </div>
              </FadeIn>
            )}

            <FadeIn className="mb-8 flex items-end justify-between">
              <h2 className="section-title">Recently Published</h2>
              <Link to="/articles" className="text-sm font-semibold text-navy-700 hover:text-gold-500">
                View all articles →
              </Link>
            </FadeIn>

            {articles.length === 0 ? (
              <p className="text-navy-500">
                No articles found yet. Run the scraper (<code>npm run scrape</code> in{' '}
                <code>/backend</code>) to populate the database.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, i) => (
                  <FadeIn key={article._id} delay={i * 60}>
                    <ArticleCard article={article} />
                  </FadeIn>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
