import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import ArticleCard from '../components/ArticleCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PageHero from '../components/PageHero.jsx';

const PAGE_SIZE = 10;

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!q.trim()) {
      setData({ items: [], total: 0, totalPages: 1 });
      return;
    }
    let active = true;
    setLoading(true);
    endpoints
      .search(q, { page, limit: PAGE_SIZE })
      .then((res) => active && setData(res.data))
      .catch(() => active && setError('Search failed. Please try again.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q, page]);

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <PageHero title="Search Results" subtitle={q ? `Showing results for "${q}"` : 'Enter a search term to get started.'} />

      <div className="container-page py-16">
        {loading && <Loading label="Searching…" />}
        {error && !loading && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {!loading && !error && q && data.items.length === 0 && (
          <EmptyState title="No results found" message={`We couldn't find any articles matching "${q}".`} />
        )}

        {!loading && !error && data.items.length > 0 && (
          <>
            <p className="mb-6 text-sm text-navy-500">{data.total} result(s) found</p>
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
