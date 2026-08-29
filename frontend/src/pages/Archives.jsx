import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { endpoints } from '../api/client.js';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FadeIn from '../components/FadeIn.jsx';
import PageHero from '../components/PageHero.jsx';

export default function Archives() {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    endpoints
      .volumes()
      .then((res) => active && setVolumes(res.data))
      .catch(() => active && setError('Could not load archives. Is the backend running and seeded?'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHero title="Archives" subtitle="Browse published research by volume and issue." />

      <div className="container-page py-16">
        {loading && <Loading label="Loading archives…" />}
        {error && !loading && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {!loading && !error && volumes.length === 0 && (
          <EmptyState
            title="No issues published yet"
            message="Run the scraper from the backend (npm run scrape) to populate the archives."
          />
        )}

        <div className="space-y-14">
          {volumes.map((volume, vi) => (
            <FadeIn key={volume._id} delay={vi * 40}>
              <h2 className="section-title mb-6 border-b border-navy-100 pb-3">
                Volume {volume.volumeNumber}
                {volume.year ? ` (${volume.year})` : ''}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {volume.issues.map((issue) => (
                  <Link
                    key={issue._id}
                    to={`/issues/${issue._id}`}
                    className="card flex gap-4 p-4"
                  >
                    {issue.coverImage ? (
                      <img
                        src={issue.coverImage}
                        alt={issue.title}
                        className="h-28 w-20 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded bg-navy-100 text-[10px] text-navy-400">
                        No cover
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                        {issue.series}
                      </p>
                      <p className="mt-1 font-serif font-semibold text-navy-900">{issue.title}</p>
                      <p className="mt-1 text-xs text-navy-400">{issue.dateRange}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
