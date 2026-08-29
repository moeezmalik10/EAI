# EVJAI Journal Website Prototype

A full-stack prototype of an academic journal website for **EVJAI — Euro Vantage Journal of
Artificial Intelligence**, built with React (Vite) + Tailwind CSS on the frontend and
Node.js/Express + PostgreSQL (via Prisma) on the backend. The database is populated by scraping
the live journal site at [evjai.com](https://evjai.com) (an Open Journal Systems / OJS 3.4
install).

## Live Deployment

- **Frontend**: https://evjai-frontend.vercel.app
- **Backend API**: https://evjai-backend.vercel.app/api
- **Database**: Neon Postgres (Vercel Marketplace) — 71 articles / 10 issues / 3 volumes / 24
  editorial board members, scraped from the live site
- **File storage**: Vercel Blob (private) for manuscript submission uploads

Both are deployed as separate Vercel projects (`evjai-frontend`, `evjai-backend`) under the same
account, each linked via `vercel link` from its own subdirectory.

## Project Structure

```
evjai/
├── backend/                    Express API + Prisma models + scraper
│   ├── prisma/schema.prisma        Postgres schema (Issue, Article, Author, EditorialBoardMember, Submission)
│   ├── src/
│   │   ├── config/prisma.js        PrismaClient singleton
│   │   ├── scraper/                axios + cheerio scraper (parsers + orchestrator)
│   │   ├── controllers/            Route handlers
│   │   ├── routes/                 Express routers, mounted under /api
│   │   ├── middleware/             multer (memory storage) + error handler
│   │   ├── utils/                  serialize.js (id → _id), manuscriptStorage.js (Blob/local)
│   │   ├── createApp.js            Express app factory
│   │   └── server.js               Vercel entrypoint (also runs `npm start` locally)
│   ├── uploads/                 Local fallback for manuscript files (dev only, gitignored)
│   └── .env.example
├── frontend/                   React + Vite + Tailwind app
│   ├── src/
│   │   ├── api/client.js           Axios client + endpoint helpers
│   │   ├── components/             Header, Footer, ArticleCard, Pagination, etc.
│   │   ├── pages/                  Home, About, Editorial Board, Archives, Submit Paper, ...
│   │   └── App.jsx, main.jsx
│   └── .env.example
└── README.md
```

## Why Postgres instead of MongoDB

The original build used MongoDB/Mongoose. When deploying to Vercel, MongoDB Atlas turned out to
have **no Vercel Marketplace integration** (verified live via `vercel integration discover` — not
in the ~53 available integrations), and getting a MongoDB Atlas connection string manually
required dashboard steps the user couldn't complete. Rather than block on that, the backend was
rewritten onto **Neon Postgres + Prisma**, which Vercel *can* provision automatically. The REST
API contract, response shapes (including `_id` field names — see `utils/serialize.js`), and the
entire frontend were kept **unchanged**; only the database layer differs from a from-scratch
MongoDB build. `Article.authors` and `EditorialBoardMember.links` are stored as JSON columns to
preserve the original embedded-document shapes; "Volume" isn't its own table — it's computed by
grouping `Issue` rows by `volumeNumber` (see `volumesController.js`).

## Prerequisites

- **Node.js 18+** (tested with Node 24) and npm
- A **Postgres database** — either:
  - [Neon](https://neon.tech) (free tier; what production uses), provisioned automatically via
    `vercel integration add neon` if you have the Vercel CLI linked, or created directly at
    neon.tech, or
  - Any other Postgres instance (local, Docker, Supabase, etc.) — just set `POSTGRES_PRISMA_URL`
    / `POSTGRES_URL_NON_POOLING` accordingly.
- Optional: a [Vercel Blob](https://vercel.com/docs/vercel-blob) store for manuscript file
  uploads. Without one configured, uploaded files are written to `backend/uploads/` instead — the
  app works fully either way.

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
SCRAPE_URL=https://evjai.com
CLIENT_ORIGIN=http://localhost:5173

POSTGRES_PRISMA_URL=<pooled connection string>
POSTGRES_URL_NON_POOLING=<direct connection string, used for schema push/migrations>

# optional — omit to fall back to local disk storage under backend/uploads/
BLOB_READ_WRITE_TOKEN=<vercel blob token>
```

If you provisioned Neon via `vercel integration add neon` (from a `vercel link`-ed `backend/`
directory), pull these automatically instead of hand-typing them:

```bash
vercel env pull .env.local   # merge POSTGRES_* and BLOB_READ_WRITE_TOKEN into .env
```

Push the Prisma schema to your database (creates tables; safe to re-run):

```bash
npx prisma db push
```

### Run the scraper (seeds the database)

```bash
npm run scrape
```

This crawls the issue archive, every issue's table of contents, every article detail page
(using OJS's `citation_*` meta tags for reliable metadata), and the editorial board page. Issues
and the editorial board are refreshed on every run; articles are only fetched and inserted the
first time an `ojsArticleId` is seen (existing articles are left as-is on re-scrape — a later
correction to an article's abstract/DOI on the live site won't be picked up without deleting that
article's row first).

You can also trigger a re-scrape while the server is running via
`POST http://localhost:5000/api/admin/scrape` (prototype convenience endpoint, not
authenticated).

### Start the API server

```bash
npm run dev     # auto-restarts on file changes (node --watch)
# or
npm start
```

The API listens on `http://localhost:5000` (or your configured `PORT`).

## 2. Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` (Vite will pick a different port if that one's taken —
check the terminal output) and talks to the API at `VITE_API_URL`
(`http://localhost:5000/api` by default — see `frontend/.env.example`).

**If you see CORS errors in the browser console**: make sure `backend/.env`'s `CLIENT_ORIGIN`
matches the frontend's *actual* port exactly (comma-separate multiple origins, e.g.
`http://localhost:5173,http://localhost:5175`), then restart the backend — `node --watch` doesn't
pick up `.env` changes automatically.

## 3. Deploying to Vercel

Both apps are already linked as separate Vercel projects. To redeploy after changes:

```bash
cd backend && vercel --prod    # redeploy API (env vars already provisioned via Neon + Blob integrations)
cd frontend && vercel --prod   # redeploy frontend
```

Key things that made this work, in case you're replicating it:

- **Entrypoint**: Vercel's Express auto-detection scans `app`, `index`, `server`, `main` (and
  `src/` variants) in that order for a file importing the framework directly. Having both
  `app.js` (a factory, not a default export) *and* `server.js` caused Vercel to pick `app.js` and
  fail with "Invalid export found". Fixed by naming the factory file `createApp.js` (out of the
  search list) and keeping `server.js` — which does `import 'express'` directly and
  `export default app` — as the only candidate.
- **File uploads**: Vercel's function filesystem is read-only outside `/tmp`, and `/tmp` doesn't
  persist between invocations, so `multer.diskStorage()` can't be the primary path once deployed.
  `middleware/upload.js` uses `multer.memoryStorage()`, and `utils/manuscriptStorage.js` uploads
  the buffer to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, falling back to
  `backend/uploads/` otherwise (so local dev works without any Blob setup).
- **CORS vs. DB-connection ordering**: CORS middleware must run before anything that can fail
  (a DB gate, etc.) — otherwise a failed backend request comes back with no CORS headers, and the
  browser reports it as a CORS error instead of the real cause, which is confusing to debug.
- **Prisma on Vercel**: a `postinstall: "prisma generate"` script is required so the query engine
  binary gets rebuilt for Vercel's Linux build environment (a client generated locally on Windows
  won't run there).

## API Endpoints

| Method | Endpoint                     | Description                                              |
|--------|-------------------------------|------------------------------------------------------------|
| GET    | `/api/articles`               | List articles — `page`, `limit`, `volume`, `issue`, `year`, `search` query params |
| GET    | `/api/articles/:id`           | Full article detail (includes parent issue)             |
| GET    | `/api/issues`                 | List all issues with their articles                       |
| GET    | `/api/issues/:id`              | Single issue with full article list                        |
| GET    | `/api/volumes`                | List all volumes with nested issues (computed, not stored) |
| GET    | `/api/editorial-board`        | Editorial board members, grouped by role                   |
| POST   | `/api/submissions`            | Submit a manuscript (multipart form; stores metadata + optional file) |
| GET    | `/api/search?q=...`           | Search across title, abstract, keywords, authors (`ILIKE`) |
| POST   | `/api/admin/scrape`           | Re-run the scraper (prototype convenience endpoint)         |
| GET    | `/api/health`                  | Health check                                               |

## Data Model (Prisma / Postgres)

- **Issue** — `ojsIssueId` (unique), `volumeNumber`/`issueNumber`/`year`, `series`, `dateRange`,
  `coverImage`, related `Article[]` rows via `Article.issueId`
- **Article** — `ojsArticleId` (unique), `title`, `authors` (JSON `{name, affiliation}[]`),
  `abstract`, `keywords` (`String[]`), `doi` (unique, nullable), `volumeNumber`/`issueNumber`/
  `year`, `firstPage`/`lastPage`, `publishedDate`, `pdfUrl`, `issueId` FK — searched via `ILIKE`
  on title/abstract/authors-as-text plus an `unnest(keywords)` match
- **Author** — normalized `name` (unique) with an `affiliations` string array
- **EditorialBoardMember** — `name`, `role` (Chief Editor / Managing Editor / Editorial Board),
  `affiliation`, `country`, `email`, `links` (JSON: orcid/linkedin/googleScholar/researchGate)
- **Submission** — prototype manuscript intake: `title`, `abstract`, `authors`, `keywords`
  (`String[]`), `correspondingEmail`, `manuscriptFile` (JSON: storage/url/storedName/etc.),
  `status`
- All primary keys are Prisma field `id` (cuid) — API responses rename this to `_id` via
  `utils/serialize.js` so the frontend (and the rest of this doc) can keep referring to `_id`.

## How the Scraper Works

EVJAI runs on **Open Journal Systems (OJS) 3.4**, which emits stable, semantically-labeled
markup and Google-Scholar-style `citation_*` `<meta>` tags on every article page. The scraper
(`backend/src/scraper/`) takes advantage of this:

1. `parseIssueList.js` — parses `.obj_issue_summary` blocks on the archive page into issue
   summaries (volume/issue/year parsed from the `"Vol. X No. Y (YYYY)"` series text), and
   `.obj_article_summary` blocks on an issue's table-of-contents page into article links.
2. `parseArticle.js` — reads `citation_title`, `citation_author` (+ `citation_author_institution`),
   `citation_abstract`, `citation_keywords`, `citation_doi`, `citation_volume/issue`,
   `citation_firstpage/lastpage`, `citation_date`, and `citation_pdf_url` meta tags, falling back
   to the visible `.obj_article_details` DOM if any tag is missing.
3. `parseEditorialBoard.js` — the board page is unstructured rich text (paragraphs, not per-member
   markup), so this parser walks paragraphs in order, tracks the current role heading (Chief
   Editor / Managing Editor / Editorial Board), splits each member paragraph into name/affiliation/
   country by comma position, extracts email via regex, and merges trailing "links only"
   paragraphs (Google Scholar / LinkedIn / ORCID / ResearchGate) into the preceding member.
4. `index.js` orchestrates all of the above and upserts into Postgres via Prisma, keyed by OJS's
   own numeric article/issue IDs so re-running the scraper never creates duplicates.

## Frontend Features

- Sticky header with collapsible mobile nav and a live search bar
- Home page: hero, journal metrics, current issue highlight, recent articles
- Archives page grouped by volume, each issue linking to its full table of contents
- Article list with pagination, year/volume filters, and a dedicated search results page
- Article detail page: abstract, keywords, authors + affiliations, DOI link, PDF download
- Submit Paper form with client-side validation, file upload, and toast notifications
- Static About, Author Guidelines, Editorial Board (data-driven), and Contact pages
- Scroll-triggered fade-in animations, hover states on cards/buttons, loading spinners

## Notes & Limitations (Prototype Scope)

- **The frontend has not been visually verified in a real browser** — no browser automation was
  available during development. What *was* verified, end-to-end, on the live Vercel deployment:
  `npm run build` compiling every page with no errors, every API endpoint (list/detail/search/
  filter/pagination, issues, volumes, editorial board), and a real multipart file upload through
  `/api/submissions` landing correctly in both Postgres and Vercel Blob. Please click through the
  pages, the mobile nav, and the submit form at the live URLs above and let me know if anything
  looks off.
- Search relevance is a simple `ILIKE` match, not ranked full-text search (no `tsvector`/`GIN`
  index) — fine at this dataset size (~70 articles), but won't rank better/worse matches.
- The submission endpoint stores manuscript metadata in Postgres and the file in Vercel Blob (or
  `backend/uploads/` locally) — there's no review workflow, authentication, or email
  notifications.
- PDF "download" links point to the original PDFs hosted on evjai.com, since this prototype
  doesn't mirror binary files.
- The editorial board free-text parser uses heuristics (comma-position splitting) tuned to the
  live site's current formatting; if the source page's text format changes significantly, review
  `backend/src/scraper/parseEditorialBoard.js`.
- `CLIENT_ORIGIN` is an explicit comma-separated allowlist, not a wildcard — Vercel *preview*
  deployments of the frontend (which get dynamic URLs per-deploy) will be CORS-rejected by the
  backend until their URL is added. The production alias (`evjai-frontend.vercel.app`) is
  allowlisted and works.
