import { useEffect, useState } from 'react';
import { endpoints } from '../api/client.js';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FadeIn from '../components/FadeIn.jsx';
import PageHero from '../components/PageHero.jsx';

const ROLE_LABELS = {
  'Chief Editor': 'Chief Editor',
  'Managing Editor': 'Managing Editor',
  'Editorial Board': 'Editorial Board Members',
  'Advisory Board': 'Advisory Board',
};

export default function EditorialBoard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    endpoints
      .editorialBoard()
      .then((res) => active && setMembers(res.data))
      .catch(() => active && setError('Could not load the editorial board. Is the backend running and seeded?'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const grouped = members.reduce((acc, m) => {
    acc[m.role] = acc[m.role] || [];
    acc[m.role].push(m);
    return acc;
  }, {});

  return (
    <div>
      <PageHero
        title="Editorial Board"
        subtitle="An international team of scholars overseeing peer review and editorial direction."
      />

      <div className="container-page py-16">
        {loading && <Loading label="Loading editorial board…" />}
        {error && !loading && <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {!loading && !error && members.length === 0 && (
          <EmptyState
            title="No editorial board data yet"
            message="Run the scraper from the backend (npm run scrape) to populate this page."
          />
        )}

        {!loading &&
          !error &&
          Object.entries(ROLE_LABELS).map(([role, label]) =>
            grouped[role]?.length ? (
              <section key={role} className="mb-14">
                <h2 className="section-title mb-6">{label}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[role].map((member, i) => (
                    <FadeIn key={member._id} delay={i * 50}>
                      <MemberCard member={member} />
                    </FadeIn>
                  ))}
                </div>
              </section>
            ) : null
          )}
      </div>
    </div>
  );
}

function MemberCard({ member }) {
  const links = Object.entries(member.links || {}).filter(([, url]) => url);
  return (
    <div className="card flex flex-col gap-2 p-5">
      <h3 className="font-serif text-base font-semibold text-navy-900">{member.name}</h3>
      {member.affiliation && <p className="text-sm text-navy-600">{member.affiliation}</p>}
      {member.country && (
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600">{member.country}</p>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} className="text-sm text-navy-500 hover:text-gold-500">
          {member.email}
        </a>
      )}
      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold text-navy-500">
          {links.map(([kind, url]) => (
            <a key={kind} href={url} target="_blank" rel="noreferrer" className="hover:text-gold-500">
              {LINK_LABELS[kind] || kind}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const LINK_LABELS = {
  orcid: 'ORCID',
  linkedin: 'LinkedIn',
  googleScholar: 'Google Scholar',
  researchGate: 'ResearchGate',
};
