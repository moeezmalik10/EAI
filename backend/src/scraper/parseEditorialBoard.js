import * as cheerio from 'cheerio';

const ROLE_HEADINGS = ['Chief Editor', 'Managing Editor', 'Editorial Board'];
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;

// Validates the trailing comma-separated token before treating it as a
// country — source bios sometimes end with a city/campus name instead
// (e.g. "University of Tartu, ... Tartu"), which would otherwise be
// mislabeled as the member's country.
const KNOWN_COUNTRIES = new Set(
  [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
    'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia',
    'Croatia', 'Cyprus', 'Czechia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia',
    'Ethiopia', 'Fiji', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon',
    'Lithuania', 'Luxembourg', 'Malaysia', 'Maldives', 'Malta', 'Mauritius', 'Mexico',
    'Morocco', 'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Oman',
    'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
    'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Tanzania',
    'Thailand', 'Tunisia', 'Turkey', 'UAE', 'Uganda', 'UK', 'Ukraine',
    'United Arab Emirates', 'United Kingdom', 'Ukraine', 'USA', 'United States',
    'United States of America', 'Uzbekistan', 'Vietnam', 'Yemen',
  ].map((c) => c.toLowerCase())
);

function isKnownCountry(token) {
  return KNOWN_COUNTRIES.has(token.toLowerCase());
}

function classifyLink(href = '') {
  if (/orcid\.org/i.test(href)) return 'orcid';
  if (/linkedin\.com/i.test(href)) return 'linkedin';
  if (/scholar\.google/i.test(href)) return 'googleScholar';
  if (/researchgate\.net/i.test(href)) return 'researchGate';
  return null;
}

function splitNameAffiliationCountry(infoText) {
  const tokens = infoText
    .split(',')
    .map((t) => t.trim().replace(/\.$/, ''))
    .filter(Boolean);

  const name = tokens[0] || infoText.trim();
  let affiliation = '';
  let country = '';

  if (tokens.length === 2) {
    affiliation = tokens[1];
  } else if (tokens.length >= 3) {
    const last = tokens[tokens.length - 1];
    if (isKnownCountry(last)) {
      country = last;
      affiliation = tokens.slice(1, -1).join(', ');
    } else {
      // Not a real country (e.g. a trailing city name) — keep it as part
      // of the affiliation instead of mislabeling it as the country.
      affiliation = tokens.slice(1).join(', ');
    }
  }

  return { name, affiliation, country };
}

/**
 * Parses the free-text Editorial Board page (rich-text content, not
 * structured markup) into individual member records, grouping trailing
 * "link only" paragraphs (Google Scholar / LinkedIn / ORCID / ResearchGate)
 * into the preceding member.
 */
export function parseEditorialBoard(html, { defaultRole = 'Editorial Board' } = {}) {
  const $ = cheerio.load(html);
  const container = $('.page').first().length ? $('.page').first() : $('.pkp_structure_main');

  const members = [];
  let currentRole = defaultRole;
  let order = 0;

  container.children('p, h4, h2, h3').each((_, el) => {
    const node = $(el);
    const tag = el.tagName?.toLowerCase();
    const rawText = node.text().replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

    if (!rawText) return;

    if (tag === 'h4' || tag === 'h2' || tag === 'h3') {
      const heading = ROLE_HEADINGS.find((r) => r.toLowerCase() === rawText.toLowerCase());
      if (heading) currentRole = heading;
      return;
    }

    // A paragraph that is *only* a role label, e.g. <p><strong>Chief Editor</strong></p>
    const soleStrongText = node.children().length === 1 && node.find('> strong').length === 1
      ? node.find('> strong').first().text().trim()
      : null;
    if (soleStrongText && ROLE_HEADINGS.some((r) => r.toLowerCase() === soleStrongText.toLowerCase())) {
      currentRole = ROLE_HEADINGS.find((r) => r.toLowerCase() === soleStrongText.toLowerCase());
      return;
    }

    const links = {};
    node.find('a').each((__, a) => {
      const kind = classifyLink($(a).attr('href'));
      if (kind) links[kind] = $(a).attr('href');
    });

    // Strip the anchor text out to see how much "real" content is left.
    const clone = node.clone();
    clone.find('a').remove();
    const textWithoutLinks = clone.text().replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

    const isLinkOnlyParagraph = textWithoutLinks.length === 0 && Object.keys(links).length > 0;

    if (isLinkOnlyParagraph && members.length > 0) {
      Object.assign(members[members.length - 1].links, links);
      return;
    }

    if (!textWithoutLinks) return;

    const email = (rawText.match(EMAIL_RE) || [])[0] || '';
    const infoText = rawText
      .replace(/email\s*:?.*/i, '')
      .trim()
      .replace(/,$/, '');

    const { name, affiliation, country } = splitNameAffiliationCountry(infoText);
    if (!name) return;

    order += 1;
    members.push({
      name,
      role: currentRole,
      affiliation,
      country,
      email,
      links,
      order,
    });
  });

  return members;
}
