import type { Author, Publication, Topic } from '../types/scholar';

// CORS proxy configuration
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?'
];

// Add this function to extract scholar ID from URL
export function extractScholarId(url: string): string {
  const match = url.match(/user=([^&]+)/);
  return match ? match[1] : '';
}

async function fetchWithFallback(url: string): Promise<Response> {
  let lastError;
  
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url));
      if (response.ok) {
        return response;
      }
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  
  throw lastError || new Error('All proxy attempts failed');
}

async function fetchHtml(url: string): Promise<Document> {
  const response = await fetchWithFallback(url);
  const html = await response.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

async function fetchAllPublications(userId: string): Promise<Publication[]> {
  const publications: Publication[] = [];
  let start = 0;
  const pageSize = 100;
  let hasMore = true;
  let retryCount = 0;
  const maxRetries = 3;
  const maxPublications = 1000; // Safety limit

  while (hasMore && publications.length < maxPublications) {
    try {
      const url = `https://scholar.google.com/citations?user=${userId}&cstart=${start}&pagesize=${pageSize}&sortby=pubdate`;
      const doc = await fetchHtml(url);
      
      const rows = Array.from(doc.querySelectorAll('#gsc_a_b .gsc_a_tr'));
      
      if (rows.length === 0) {
        hasMore = false;
        break;
      }

      let newPublicationsFound = false;
      for (const row of rows) {
        const titleEl = row.querySelector('.gsc_a_t a');
        const authorsEl = row.querySelector('.gsc_a_t div');
        const venueEl = row.querySelector('.gsc_a_t .gs_gray:last-child');
        const yearEl = row.querySelector('.gsc_a_y span');
        const citationsEl = row.querySelector('.gsc_a_c');

        if (titleEl && authorsEl) {
          const url = titleEl.getAttribute('href');
          const title = titleEl.textContent?.trim() || '';
          
          // Check if we already have this publication
          if (!publications.some(p => p.title === title)) {
            const pub = {
              title,
              authors: authorsEl.textContent?.split(',').map(a => a.trim()) || [],
              year: parseInt(yearEl?.textContent || '0', 10) || new Date().getFullYear(),
              citations: parseInt(citationsEl?.textContent || '0', 10) || 0,
              venue: venueEl?.textContent?.trim() || '',
              url: url ? `https://scholar.google.com${url}` : ''
            };
            
            publications.push(pub);
            newPublicationsFound = true;
          }
        }
      }

      // If we didn't find any new publications, we might be at the end
      if (!newPublicationsFound) {
        hasMore = false;
        break;
      }

      // Check for "Show more" button
      const showMoreButton = doc.querySelector('#gsc_bpf_more:not([disabled])');
      if (!showMoreButton) {
        hasMore = false;
      } else {
        start += pageSize;
        retryCount = 0; // Reset retry count on successful fetch
      }

      // Add a delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error('Error fetching publications page:', error);
      retryCount++;

      if (retryCount >= maxRetries) {
        console.warn(`Stopped fetching after ${retryCount} failed attempts`);
        hasMore = false;
      } else {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
    }
  }

  // Sort publications by year (newest first)
  return publications.sort((a, b) => b.year - a.year);
}

function calculateMetrics(publications: Publication[], citationsPerYear: Record<number, number>) {
  const currentYear = new Date().getFullYear();
  const citations = publications.map(p => p.citations).sort((a, b) => b - a);
  
  // Calculate h-index
  let hIndex = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) hIndex = i + 1;
    else break;
  }

  // Calculate g-index
  let gIndex = 0;
  let sum = 0;
  for (let i = 0; i < citations.length; i++) {
    sum += citations[i];
    if (sum >= Math.pow(i + 1, 2)) gIndex = i + 1;
    else break;
  }

  // Calculate i10-index
  const i10Index = citations.filter(c => c >= 10).length;

  // Calculate h5-index (last 5 years)
  const recentPubs = publications.filter(p => p.year > currentYear - 5);
  const recentCitations = recentPubs.map(p => p.citations).sort((a, b) => b - a);
  let h5Index = 0;
  for (let i = 0; i < recentCitations.length; i++) {
    if (recentCitations[i] >= i + 1) h5Index = i + 1;
    else break;
  }

  // Calculate ACC5 (citations in last 5 years)
  const acc5 = publications
    .filter(p => p.year > currentYear - 5)
    .reduce((sum, p) => sum + p.citations, 0);

  // Calculate collaboration metrics
  const totalPubs = publications.length;
  
  // Get all co-authors (excluding duplicates)
  const uniqueCoAuthors = new Set<string>();
  const authorNameFrequency = new Map<string, number>();
  
  publications.forEach(pub => {
    pub.authors.forEach(author => {
      const normalizedName = author.toLowerCase().trim();
      uniqueCoAuthors.add(normalizedName);
      authorNameFrequency.set(
        normalizedName, 
        (authorNameFrequency.get(normalizedName) || 0) + 1
      );
    });
  });

  // Find the author's name (most frequent name in publications)
  const authorName = Array.from(authorNameFrequency.entries())
    .sort((a, b) => b[1] - a[1])[0][0];

  // Remove the author from co-author count
  uniqueCoAuthors.delete(authorName);
  const totalCoAuthors = uniqueCoAuthors.size;

  // Calculate collaboration metrics
  const soloPublications = publications.filter(p => p.authors.length === 1);
  const coAuthoredPubs = publications.filter(p => p.authors.length > 1);
  
  const collaborationScore = Math.round((coAuthoredPubs.length / totalPubs) * 100);
  const soloAuthorScore = Math.round((soloPublications.length / totalPubs) * 100);
  
  // Calculate average authors per publication
  const totalAuthors = publications.reduce((sum, pub) => sum + pub.authors.length, 0);
  const averageAuthors = Number((totalAuthors / totalPubs).toFixed(1));

  // Calculate publications per year
  const years = Object.keys(citationsPerYear).map(Number);
  const yearSpan = Math.max(1, Math.max(...years) - Math.min(...years) + 1);
  const publicationsPerYear = (totalPubs / yearSpan).toFixed(1);

  // Find top paper by citations
  const topPaper = publications.reduce((max, pub) => 
    pub.citations > max.citations ? pub : max, 
    publications[0]
  );

  // Find most common co-author
  const coAuthorFrequency = new Map<string, {
    count: number;
    papers: Publication[];
    name: string;
  }>();

  publications.forEach(pub => {
    pub.authors.forEach(author => {
      if (author.toLowerCase() !== authorName) {
        const key = author.toLowerCase();
        const existing = coAuthorFrequency.get(key) || { count: 0, papers: [], name: author };
        existing.count++;
        existing.papers.push(pub);
        coAuthorFrequency.set(key, existing);
      }
    });
  });

  // Get top co-author
  const topCoAuthor = Array.from(coAuthorFrequency.values())
    .sort((a, b) => b.count - a.count)[0];

  return {
    hIndex,
    gIndex,
    i10Index,
    h5Index,
    acc5,
    collaborationScore,
    soloAuthorScore,
    totalPublications: totalPubs,
    publicationsPerYear,
    citationsPerYear,
    averageAuthors,
    totalCoAuthors,
    topPaperCitations: topPaper.citations,
    topPaperTitle: topPaper.title,
    topPaperUrl: topPaper.url,
    eIndex: 0,
    mIndex: 0,
    aIndex: 0,
    arIndex: 0,
    rIndex: 0,
    hcIndex: 0,
    hiIndex: 0,
    hpIndex: 0,
    sIndex: '0%',
    rcr: '0',
    selfCitationRate: '0%',
    ...(topCoAuthor ? {
      topCoAuthor: topCoAuthor.name,
      topCoAuthorPapers: topCoAuthor.count,
      topCoAuthorFirstYear: Math.min(...topCoAuthor.papers.map(p => p.year)),
      topCoAuthorLatestPaper: topCoAuthor.papers.sort((a, b) => b.year - a.year)[0].title,
      topCoAuthorLatestPaperUrl: topCoAuthor.papers.sort((a, b) => b.year - a.year)[0].url,
      topCoAuthorLatestPaperYear: topCoAuthor.papers.sort((a, b) => b.year - a.year)[0].year
    } : {})
  };
}

export async function fetchScholarProfile(url: string): Promise<Author> {
  try {
    const urlPattern = /^https:\/\/scholar\.google\.com\/citations\?user=([\w-]+)/;
    const match = url.match(urlPattern);
    if (!match) {
      throw new Error('Invalid Google Scholar URL format. Please enter a valid profile URL.');
    }

    const userId = match[1];
    const doc = await fetchHtml(url);
    
    // Extract basic info
    const name = doc.querySelector('#gsc_prf_in')?.textContent?.trim() || '';
    const affiliation = doc.querySelector('.gsc_prf_il')?.textContent?.trim() || '';
    const imageUrl = doc.querySelector('#gsc_prf_pup-img')?.getAttribute('src');
    
    if (!name) {
      throw new Error('Could not find profile data. Please check the URL and try again.');
    }

    // Extract topics
    const topics: Topic[] = Array.from(doc.querySelectorAll('#gsc_prf_int a')).map(el => ({
      name: el.textContent?.trim() || '',
      url: 'https://scholar.google.com' + (el.getAttribute('href') || ''),
      paperCount: parseInt(el.nextElementSibling?.textContent?.replace(/[()]/g, '') || '0', 10)
    }));

    // Fetch all publications with pagination
    const publications = await fetchAllPublications(userId);

    // Extract citations per year
    const citationsPerYear: Record<number, number> = {};
    const yearLabels = Array.from(doc.querySelectorAll('.gsc_g_t')).map(el => parseInt(el.textContent || '0', 10));
    const citationBars = Array.from(doc.querySelectorAll('.gsc_g_a')).map(el => parseInt(el.textContent || '0', 10));
    yearLabels.forEach((year, i) => citationsPerYear[year] = citationBars[i]);

    // Calculate total citations
    const totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0);

    // Calculate all metrics
    const metrics = calculateMetrics(publications, citationsPerYear);

    return {
      name,
      affiliation,
      imageUrl,
      topics,
      hIndex: metrics.hIndex,
      totalCitations,
      publications,
      metrics
    };
  } catch (error) {
    console.error('Error fetching scholar profile:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch profile data');
  }
}