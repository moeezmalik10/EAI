import FadeIn from '../components/FadeIn.jsx';
import PageHero from '../components/PageHero.jsx';

export default function About() {
  return (
    <div>
      <PageHero
        title="About the Journal"
        subtitle="Understanding our mission, scope, and commitment to open scholarship."
      />

      <div className="container-page grid grid-cols-1 gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FadeIn>
            <h2 className="section-title mb-4">Overview</h2>
            <p className="mb-4 text-navy-600">
              The <strong>Euro Vantage Journal of Artificial Intelligence (EVJAI)</strong> is a
              premier, peer-reviewed, open-access academic journal dedicated to advancing
              research at the intersection of artificial intelligence and its real-world
              applications. EVJAI publishes original research articles, systematic reviews, and
              case studies spanning machine learning, deep learning, natural language
              processing, computer vision, robotics, and AI ethics.
            </p>
            <p className="mb-4 text-navy-600">
              The journal is committed to rigorous, transparent peer review and to making
              cutting-edge AI research freely accessible to researchers, practitioners, and
              policymakers worldwide, without cost to readers or barriers to authors.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <h2 className="section-title mb-4 mt-10">Aims &amp; Scope</h2>
            <p className="mb-4 text-navy-600">
              EVJAI welcomes submissions that make a substantive contribution to the theory,
              methodology, or application of artificial intelligence, including but not limited
              to:
            </p>
            <ul className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                'Machine Learning & Deep Learning',
                'Natural Language Processing',
                'Computer Vision & Pattern Recognition',
                'AI Ethics, Fairness & Governance',
                'Robotics & Autonomous Systems',
                'AI in Healthcare & Life Sciences',
                'Explainable & Trustworthy AI',
                'AI-Driven Automation & Economics',
              ].map((topic) => (
                <li key={topic} className="flex items-start gap-2 text-sm text-navy-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {topic}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={200}>
            <h2 className="section-title mb-4 mt-10">Publisher</h2>
            <p className="text-navy-600">
              EVJAI is published by Euro Vantage Journals on the Open Journal Systems (OJS)
              platform, in partnership with an international editorial board spanning multiple
              countries and institutions.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={150}>
          <aside className="card sticky top-24 space-y-5 p-6">
            <h3 className="font-serif text-lg font-semibold text-navy-900">Journal Details</h3>
            <dl className="space-y-3 text-sm">
              <Detail label="Chief Editor" value="Dr. Hafsa Shareef Dar" />
              <Detail label="Location" value="Gujrat, Pakistan" />
              <Detail label="ISSN (Online)" value="3080-4051" />
              <Detail label="ISSN (Print)" value="3080-3403" />
              <Detail label="Frequency" value="Quarterly" />
              <Detail label="DOI Prefix" value="10.65923" />
              <Detail label="Access Model" value="Open Access" />
              <Detail label="Contact Email" value="noman.mazher@gmail.com" href="mailto:noman.mazher@gmail.com" />
              <Detail label="Contact Phone" value="3016258369" />
            </dl>
          </aside>
        </FadeIn>
      </div>
    </div>
  );
}

function Detail({ label, value, href }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy-50 pb-2">
      <dt className="text-navy-500">{label}</dt>
      <dd className="text-right font-medium text-navy-800">
        {href ? (
          <a href={href} className="hover:text-gold-500">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
