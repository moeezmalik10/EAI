import FadeIn from '../components/FadeIn.jsx';
import PageHero from '../components/PageHero.jsx';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. Scope & Manuscript Types',
    body: [
      'EVJAI accepts original research articles, review articles, short communications, and case studies within the fields of artificial intelligence, machine learning, and related applied disciplines.',
      'Manuscripts must present previously unpublished work and must not be under consideration elsewhere at the time of submission.',
    ],
  },
  {
    title: '2. Manuscript Preparation',
    body: [
      'Manuscripts should be prepared in English, using a standard 12-point font (e.g., Times New Roman), 1.5 line spacing, and A4 page size with 1-inch margins.',
      'Papers should typically be between 4,000 and 8,000 words, including references, tables, and figures, though exceptions may be made for comprehensive reviews.',
      'The manuscript should include: Title, Abstract (150–250 words), Keywords (4–6 terms), Introduction, Methodology, Results, Discussion, Conclusion, Acknowledgements (if applicable), and References.',
    ],
  },
  {
    title: '3. Reference Style',
    body: [
      'EVJAI follows APA (7th edition) citation style for in-text citations and the reference list. Authors are responsible for verifying the accuracy of all citations and DOIs.',
    ],
  },
  {
    title: '4. Submission Process',
    body: [
      'Manuscripts are submitted electronically via the Submit Paper page. Authors should provide the manuscript file, a complete author list with affiliations, and a corresponding author email.',
      'Upon submission, authors receive an acknowledgement email. Manuscripts are then screened by the editorial office for scope and formatting compliance before being assigned to peer reviewers.',
    ],
  },
  {
    title: '5. Peer Review Process',
    body: [
      'EVJAI operates a double-blind peer review process. Each submission is evaluated by at least two independent reviewers with relevant subject-matter expertise.',
      'The typical time to a first editorial decision is approximately 20 days, though this may vary depending on reviewer availability and manuscript complexity.',
    ],
  },
  {
    title: '6. Publication Ethics',
    body: [
      'Authors must ensure their work is original and, where applicable, appropriately cites the work of others. All submissions are screened for plagiarism prior to review.',
      'Authors must disclose any conflicts of interest and confirm that the research complies with applicable ethical standards, including informed consent and institutional review where human subjects are involved.',
      'EVJAI adheres to the Committee on Publication Ethics (COPE) guidelines for handling allegations of research or publication misconduct.',
    ],
  },
  {
    title: '7. Article Processing Charges (APC)',
    body: [
      'As an open-access journal, EVJAI may apply an Article Processing Charge (APC) upon acceptance to support editorial handling, production, and indexing costs. Fee waivers may be available for authors from low-income institutions — contact the editorial office for details.',
    ],
  },
  {
    title: '8. Copyright & Licensing',
    body: [
      'Authors retain copyright of their published work. Articles are published under a Creative Commons Attribution (CC BY) license, allowing free reuse with appropriate attribution.',
    ],
  },
];

export default function AuthorGuidelines() {
  return (
    <div>
      <PageHero
        title="Author Guidelines"
        subtitle="Everything you need to know before submitting your manuscript to EVJAI."
      />

      <div className="container-page grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1fr_260px]">
        <div className="space-y-10">
          {SECTIONS.map((section, i) => (
            <FadeIn key={section.title} delay={i * 40}>
              <h2 className="mb-3 font-serif text-xl font-bold text-navy-900">{section.title}</h2>
              {section.body.map((p) => (
                <p key={p.slice(0, 24)} className="mb-3 text-navy-600">
                  {p}
                </p>
              ))}
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={100}>
          <aside className="card sticky top-24 space-y-4 p-6">
            <h3 className="font-serif text-lg font-semibold text-navy-900">Ready to submit?</h3>
            <p className="text-sm text-navy-500">
              Prepare your manuscript according to the guidelines above, then submit it directly
              through our online form.
            </p>
            <Link to="/submit" className="btn-primary w-full">
              Submit Your Paper
            </Link>
          </aside>
        </FadeIn>
      </div>
    </div>
  );
}
