import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white/80">
      <div className="container-page grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 font-serif text-base font-bold text-navy-900">
              EV
            </span>
            <span className="font-serif text-lg font-bold text-white">EVJAI</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            Euro Vantage Journal of Artificial Intelligence is a peer-reviewed, open-access
            journal publishing original research across machine learning, deep learning, and
            AI ethics.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-gold-400">About the Journal</Link></li>
            <li><Link to="/editorial-board" className="hover:text-gold-400">Editorial Board</Link></li>
            <li><Link to="/archives" className="hover:text-gold-400">Archives</Link></li>
            <li><Link to="/author-guidelines" className="hover:text-gold-400">Author Guidelines</Link></li>
            <li><Link to="/submit" className="hover:text-gold-400">Submit a Paper</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Journal Info
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>ISSN (Online): 3080-4051</li>
            <li>ISSN (Print): 3080-3403</li>
            <li>Publication Frequency: Quarterly</li>
            <li>DOI Prefix: 10.65923</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>
              Email:{' '}
              <a href="mailto:noman.mazher@gmail.com" className="hover:text-gold-400">
                noman.mazher@gmail.com
              </a>
            </li>
            <li>Phone: 3016258369</li>
            <li>
              <Link to="/contact" className="hover:text-gold-400">
                Full contact details →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} Euro Vantage Journal of Artificial Intelligence (EVJAI). All rights reserved.</p>
          <p>Prototype built for demonstration purposes — data sourced from evjai.com.</p>
        </div>
      </div>
    </footer>
  );
}
