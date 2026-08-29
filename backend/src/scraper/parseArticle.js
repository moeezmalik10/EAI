import * as cheerio from 'cheerio';

function metaContents($, name) {
  return $(`meta[name="${name}"]`)
    .map((_, el) => $(el).attr('content')?.trim())
    .get()
    .filter(Boolean);
}

/**
 * Parses an OJS article detail page. Relies primarily on the Google-Scholar
 * style `citation_*` meta tags OJS emits (stable across themes), and falls
 * back to the visible .obj_article_details DOM for anything meta tags miss.
 */
export function parseArticleDetail(html, sourceUrl, ojsArticleId) {
  const $ = cheerio.load(html);

  const title =
    metaContents($, 'citation_title')[0] ||
    $('h1.page_title').first().text().trim().replace(/\s+/g, ' ');

  const authorNames = metaContents($, 'citation_author');
  const authorInstitutions = metaContents($, 'citation_author_institution');
  let authors = authorNames.map((name, i) => ({
    name,
    affiliation: authorInstitutions[i] || '',
  }));

  if (authors.length === 0) {
    authors = $('.item.authors ul.authors > li')
      .map((_, li) => ({
        name: $(li).find('.name').text().trim().replace(/\s+/g, ' '),
        affiliation: $(li).find('.affiliation').text().trim().replace(/\s+/g, ' '),
      }))
      .get()
      .filter((a) => a.name);
  }

  const abstract =
    metaContents($, 'citation_abstract')[0] ||
    $('.item.abstract p').text().trim().replace(/\s+/g, ' ');

  const keywords = metaContents($, 'citation_keywords');
  if (keywords.length === 0) {
    const kwText = $('.item.keywords .value').text().trim();
    if (kwText) keywords.push(...kwText.split(',').map((k) => k.trim()).filter(Boolean));
  }

  const doiRaw = metaContents($, 'citation_doi')[0];
  const doi = doiRaw ? doiRaw.replace(/^https?:\/\/doi\.org\//i, '') : undefined;

  const volumeNumber = Number(metaContents($, 'citation_volume')[0]) || undefined;
  const issueNumber = Number(metaContents($, 'citation_issue')[0]) || undefined;
  const firstPage = Number(metaContents($, 'citation_firstpage')[0]) || undefined;
  const lastPage = Number(metaContents($, 'citation_lastpage')[0]) || undefined;

  const dateRaw = metaContents($, 'citation_date')[0] || $('.item.published .value span').text().trim();
  const publishedDate = dateRaw ? new Date(dateRaw.replace(/\//g, '-')) : undefined;
  const year = publishedDate && !Number.isNaN(publishedDate.valueOf()) ? publishedDate.getFullYear() : undefined;

  const pdfUrl =
    metaContents($, 'citation_pdf_url')[0] ||
    $('a.obj_galley_link.pdf').first().attr('href') ||
    '';

  const section = $('.item.issue .sub_item .label')
    .filter((_, el) => $(el).text().trim() === 'Section')
    .next('.value')
    .text()
    .trim() || 'Articles';

  return {
    ojsArticleId,
    sourceUrl,
    title,
    authors,
    abstract,
    keywords,
    doi,
    volumeNumber,
    issueNumber,
    year,
    firstPage,
    lastPage,
    publishedDate: publishedDate && !Number.isNaN(publishedDate.valueOf()) ? publishedDate : undefined,
    pdfUrl,
    section,
  };
}
