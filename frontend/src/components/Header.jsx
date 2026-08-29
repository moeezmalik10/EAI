import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/editorial-board', label: 'Editorial Board' },
  { to: '/archives', label: 'Archives' },
  { to: '/author-guidelines', label: 'Author Guidelines' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-gold-400 ${
      isActive ? 'text-gold-400' : 'text-white/90'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-navy-800 shadow-md">
      <div className="border-b border-white/10 bg-navy-900/60">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs text-white/70">
          <span>ISSN (Online): 3080-4051 &nbsp;|&nbsp; ISSN (Print): 3080-3403</span>
          <span>Quarterly &nbsp;|&nbsp; Open Access &nbsp;|&nbsp; Peer-Reviewed</span>
        </div>
      </div>

      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 font-serif text-lg font-bold text-navy-900">
            EV
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold text-white sm:text-xl">EVJAI</span>
            <span className="block text-[11px] uppercase tracking-wide text-white/70 sm:text-xs">
              Euro Vantage Journal of AI
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              aria-label="Search articles"
              className="w-56 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white placeholder:text-white/50 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/70 hover:text-gold-400"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
          <Link to="/submit" className="btn-gold">
            Submit Paper
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-navy-800 lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:border-gold-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/70 hover:text-gold-400"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </form>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-white/10 text-gold-400' : 'text-white/90 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/submit" className="btn-gold mt-2" onClick={() => setMenuOpen(false)}>
              Submit Paper
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
