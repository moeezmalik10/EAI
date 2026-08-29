import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import ArticleCard from '../components/ArticleCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHero from '../components/PageHero.jsx';

const PAGE_SIZE = 10;

export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const year = searchParams.get('year') || '';
  const volume = searchParams.get('volume') || '';

  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    endpoints
      .articles({ page, limit: PAGE_SIZE, year: year || undefined, volume: volume || undefined })
      .then((res) => active && setData(res.data))
      .catch(() => active && setError('Could not load articles. Is the backend running and seeded?'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [page, year, volume]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <PageHero title="All Articles" subtitle="Browse the full catalog of published research." />

      <div className="container-page py-16">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <input
            type="number"
            placeholder="Filter by year"
            value={year}
            onChange={(e) => updateParam('year', e.target.value)}
            className="w-40 rounded-md border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <input
            type="number"
            placeholder="Filter by volume"
            value={volume}
            onChange={(e) => updateParam('volume', e.target.value)}
            className="w-40 rounded-md border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          {(year || volume) && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="text-sm font-semibold text-navy-500 hover:text-gold-500"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-sm text-navy-500">{data.total} article(s) found</span>
        </div>

        {loading && <Loading label="Loading articles…" />}
        {error && !loading && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {!loading && !error && data.items.length === 0 && (
          <EmptyState
            title="No articles found"
            message="Try adjusting your filters, or run the scraper to populate the database."
          />
        )}

        {!loading && !error && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination page={data.page || page} totalPages={data.totalPages} onChange={goToPage} />
          </>
        )}
      </div>
    </div>
  );
}
