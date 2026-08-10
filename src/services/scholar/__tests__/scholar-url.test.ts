import { scholarService } from '../index';

const { scholarProfileUrlFrom, looksLikeUrl } = scholarService;

describe('scholarProfileUrlFrom', () => {
  // Every string below is a real query that reached the name search in
  // production and hard-failed (SerpAPI empty + Scholar 403).
  test.each([
    ['https://scholar.google.com/citations?hl=en&user=vCbEmocAAAAJ&view_op=list_works&sortby=pubdate', 'vCbEmocAAAAJ'],
    ['https://scholar.google.com/citations?user=buFPGsIAAAAJ&hl=en&oi=ao', 'buFPGsIAAAAJ'],
    ['https://scholar.google.com/citations?user=C4AAnv8AAAAJ&hl=en', 'C4AAnv8AAAAJ'],
    ['https://scholar.google.com/citations?user=CdvVaskAAAAJ&hl=en', 'CdvVaskAAAAJ'],
  ])('recognises %s', (input, expectedId) => {
    expect(scholarProfileUrlFrom(input)).toBe(
      `https://scholar.google.com/citations?user=${expectedId}`
    );
  });

  test('accepts a scheme-less URL', () => {
    expect(scholarProfileUrlFrom('scholar.google.com/citations?user=NOSPtp8AAAAJ'))
      .toBe('https://scholar.google.com/citations?user=NOSPtp8AAAAJ');
  });

  test('accepts a country domain', () => {
    expect(scholarProfileUrlFrom('https://scholar.google.de/citations?user=NOSPtp8AAAAJ&hl=de'))
      .toBe('https://scholar.google.com/citations?user=NOSPtp8AAAAJ');
  });

  test('trims surrounding whitespace', () => {
    expect(scholarProfileUrlFrom('  https://scholar.google.com/citations?user=NOSPtp8AAAAJ  '))
      .toBe('https://scholar.google.com/citations?user=NOSPtp8AAAAJ');
  });

  test.each([
    ['a plain name', 'Michael K Zürn'],
    ['a Scholar link with no profile id', 'https://scholar.google.com/citations?view_op=search_authors&mauthors=jonas+heller'],
    ['a short user id', 'https://scholar.google.com/citations?user=tooshort'],
    ['a non-Scholar URL', 'https://orcid.org/0000-0002-3214-0724'],
    ['an empty string', ''],
  ])('returns null for %s', (_label, input) => {
    expect(scholarProfileUrlFrom(input)).toBeNull();
  });
});

describe('looksLikeUrl', () => {
  test.each([
    'https://scholar.google.com/citations?view_op=search_authors&mauthors=x',
    'http://example.org',
    'www.uni-jena.de/person',
    'orcid.org/0000-0002-3214-0724',
  ])('treats %s as a link', input => {
    expect(looksLikeUrl(input)).toBe(true);
  });

  test.each([
    'Michael K Zürn',
    'Josephine Go Jefferies Newcastle University',
    'maximus torres',
    'J. Smith Jr.',
  ])('treats %s as a name', input => {
    expect(looksLikeUrl(input)).toBe(false);
  });
});
