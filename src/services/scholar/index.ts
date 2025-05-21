import { metricsCalculator } from '../metrics';
import { ApiError } from '../../utils/api';
import { scholarFetcher } from './fetcher';
import type { Author, Publication } from '../../types/scholar';

class ScholarService {
  // Updated list of valid Google Scholar domains
  private readonly VALID_DOMAINS = [
    'scholar.google.com',
    'scholar.google.co.uk',
    'scholar.google.fr',
    'scholar.google.de',
    'scholar.google.es',
    'scholar.google.it',
    'scholar.google.nl',
    'scholar.google.co.jp',
    'scholar.google.co.kr',
    'scholar.google.com.au',
    'scholar.google.ca',
    'scholar.google.com.br',
    'scholar.google.com.mx',
    'scholar.google.co.in',
    'scholar.google.cn',
    'scholar.google.ru',
    'scholar.google.at',
    'scholar.google.ch',
    'scholar.google.se',
    'scholar.google.dk',
    'scholar.google.no',
    'scholar.google.fi',
    'scholar.google.pt',
    'scholar.google.ie',
    'scholar.google.be',
    'scholar.google.pl',
    'scholar.google.cz',
    'scholar.google.gr',
    'scholar.google.hu',
    'scholar.google.ro',
    'scholar.google.bg',
    'scholar.google.sk',
    'scholar.google.si',
    'scholar.google.hr',
    'scholar.google.ee',
    'scholar.google.lv',
    'scholar.google.lt',
    'scholar.google.com.tr',
    'scholar.google.com.sg',
    'scholar.google.com.hk',
    'scholar.google.co.th',
    'scholar.google.co.id',
    'scholar.google.com.my',
    'scholar.google.com.ph',
    'scholar.google.co.nz',
    'scholar.google.co.za',
    'scholar.google.co.il',
    'scholar.google.ae',
    'scholar.google.co.ve',
    'scholar.google.cl',
    'scholar.google.com.co',
    'scholar.google.com.ar',
    'scholar.google.com.pe'
  ];

  public validateProfileUrl(url: string): { isValid: boolean; userId?: string; message?: string } {
    console.log('[ScholarService] Validating URL:', url);
    
    try {
      // Clean the URL and remove any trailing slashes or whitespace
      const cleanUrl = url.trim().replace(/\/+$/, '');
      
      if (!cleanUrl) {
        return { 
          isValid: false, 
          message: 'Please enter a Google Scholar profile URL.' 
        };
      }

      // Check for basic URL format
      if (!/^https?:\/\//i.test(cleanUrl)) {
        return {
          isValid: false,
          message: 'Please enter a complete URL starting with http:// or https://'
        };
      }
      
      // Parse the URL
      let urlObj: URL;
      try {
        urlObj = new URL(cleanUrl);
      } catch (e) {
        return {
          isValid: false,
          message: 'The URL format is invalid. Please enter a valid Google Scholar profile URL.'
        };
      }
      
      // Check if the domain is a valid Google Scholar domain
      const host = urlObj.hostname.toLowerCase();
      const isValidDomain = this.VALID_DOMAINS.includes(host);

      if (!isValidDomain) {
        console.warn('[ScholarService] Invalid domain:', host);
        return { 
          isValid: false, 
          message: 'Please use a valid Google Scholar domain (e.g., scholar.google.com)' 
        };
      }

      // Check if it's a citations page
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (!pathParts.includes('citations')) {
        return {
          isValid: false,
          message: 'The URL must be a Google Scholar citations profile page (e.g., /citations?user=...)'
        };
      }

      // Extract user ID from URL parameters
      const userId = urlObj.searchParams.get('user');
      
      if (!userId) {
        console.warn('[ScholarService] No user ID found in URL');
        return { 
          isValid: false, 
          message: 'Missing user ID. The URL must include a user ID parameter (e.g., ?user=ABC123...)' 
        };
      }

      // Validate user ID format (alphanumeric and dashes, typical Google Scholar format)
      if (!/^[A-Za-z0-9_-]{12}(?:AAAAJ)?$/i.test(userId)) {
        console.warn('[ScholarService] Invalid user ID format');
        return { 
          isValid: false, 
          message: 'Invalid Google Scholar user ID format. The ID should be 12 characters long.' 
        };
      }

      // Check for common URL manipulation attempts
      const suspiciousParams = ['script', 'eval', 'javascript', 'alert'];
      for (const [key, value] of urlObj.searchParams.entries()) {
        if (suspiciousParams.some(param => 
          key.toLowerCase().includes(param) || 
          value.toLowerCase().includes(param)
        )) {
          return {
            isValid: false,
            message: 'Invalid URL parameters detected.'
          };
        }
      }

      console.log('[ScholarService] Valid URL, userId:', userId);
      return {
        isValid: true,
        userId
      };
    } catch (error) {
      console.warn('[ScholarService] URL validation error:', error);
      
      return { 
        isValid: false, 
        message: 'Invalid URL format. Please enter a complete Google Scholar profile URL.' 
      };
    }
  }

  public async fetchProfile(url: string): Promise<Author> {
    console.log('[ScholarService] Fetching profile:', url);
    
    const validation = this.validateProfileUrl(url);
    if (!validation.isValid || !validation.userId) {
      console.error('[ScholarService] Invalid URL format:', validation.message);
      throw new ApiError(
        validation.message || 'Please enter a valid Google Scholar profile URL',
        'INVALID_URL'
      );
    }

    try {
      const html = await scholarFetcher.fetch(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract basic author information
      const name = doc.querySelector('#gsc_prf_in')?.textContent || 'Unknown Author';
      const affiliation = doc.querySelector('.gsc_prf_il')?.textContent || 'Unknown Affiliation';

      // Extract topics
      const topics = Array.from(doc.querySelectorAll('#gsc_prf_int a')).map(el => ({
        name: el.textContent?.trim() || '',
        url: 'https://scholar.google.com' + (el.getAttribute('href') || ''),
        paperCount: parseInt(el.nextElementSibling?.textContent?.replace(/[()]/g, '') || '0', 10)
      }));

      // Get total publication count
      const totalPubsText = doc.querySelector('#gsc_a_nn')?.textContent;
      const totalPubs = totalPubsText ? parseInt(totalPubsText.match(/\d+/)?.[0] || '0', 10) : 0;

      // Fetch all publications
      const publications = await this.fetchPublications(validation.userId, totalPubs);
      
      // Calculate h-index and total citations
      const citations = publications.map(p => p.citations);
      const hIndex = metricsCalculator.calculateHIndex(citations);
      const totalCitations = citations.reduce((sum, c) => sum + c, 0);

      // Extract citations per year
      const citationsPerYear: Record<string, number> = {};
      const yearLabels = Array.from(doc.querySelectorAll('.gsc_g_t')).map(el => parseInt(el.textContent || '0', 10));
      const citationBars = Array.from(doc.querySelectorAll('.gsc_g_a')).map(el => parseInt(el.textContent || '0', 10));
      yearLabels.forEach((year, i) => citationsPerYear[year] = citationBars[i]);

      // Calculate additional metrics
      const metrics = metricsCalculator.calculateMetrics(publications, citationsPerYear, name);

      return {
        name,
        affiliation,
        topics,
        hIndex,
        totalCitations,
        publications,
        metrics
      };
    } catch (error) {
      console.error('[ScholarService] Error fetching scholar profile:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        'Failed to fetch profile data. Please try again later.',
        'FETCH_ERROR'
      );
    }
  }

  private async fetchPublications(userId: string, totalPubs: number): Promise<Publication[]> {
    console.log('[ScholarService] Fetching publications for user:', userId);
    console.log('[ScholarService] Expected total publications:', totalPubs);
    
    const publications: Publication[] = [];
    let startIndex = 0;
    const pageSize = 100; // Maximum page size supported by Google Scholar
    let hasMore = true;

    while (hasMore) {
      try {
        if (startIndex > 0) {
          console.log('[ScholarService] Waiting before fetching next page...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between requests
        }

        // Always use .com domain with English locale for consistency
        const url = `https://scholar.google.com/citations?user=${userId}&hl=en&cstart=${startIndex}&pagesize=${pageSize}&view_op=list_works`;
        console.log(`[ScholarService] Fetching publications page: ${startIndex / pageSize + 1}`);
        
        const html = await scholarFetcher.fetch(url);
        let doc: Document;
        
        try {
          const parser = new DOMParser();
          doc = parser.parseFromString(html, 'text/html');
        } catch (e) {
          const { JSDOM } = require('jsdom');
          doc = new JSDOM(html).window.document;
        }

        // Parse publications from the page
        const pubElements = doc.querySelectorAll('tr.gsc_a_tr');
        const newPubs: Publication[] = Array.from(pubElements).map(el => {
          const titleEl = el.querySelector('.gsc_a_t a');
          const citationsEl = el.querySelector('.gsc_a_c');
          const yearEl = el.querySelector('.gsc_a_y');

          return {
            title: titleEl?.textContent?.trim() || 'Unknown Title',
            authors: el.querySelector('.gs_gray')?.textContent?.split(',').map(a => a.trim()) || [],
            venue: el.querySelectorAll('.gs_gray')[1]?.textContent?.trim() || '',
            year: parseInt(yearEl?.textContent?.trim() || '0', 10),
            citations: parseInt(citationsEl?.textContent?.trim() || '0', 10),
            url: titleEl?.getAttribute('href') || '',
          };
        });

        if (newPubs.length === 0) {
          console.log('[ScholarService] No more publications found');
          hasMore = false;
          break;
        }

        publications.push(...newPubs);

        // Check if we've reached the total publications count
        if (totalPubs > 0 && publications.length >= totalPubs) {
          console.log('[ScholarService] Reached total publications count');
          hasMore = false;
          break;
        }

        // Check if we got fewer publications than the page size
        if (newPubs.length < pageSize) {
          console.log('[ScholarService] Last page reached (incomplete page)');
          hasMore = false;
          break;
        }

        startIndex += pageSize;

      } catch (error) {
        console.error('[ScholarService] Error fetching publications:', error);
        if (publications.length > 0) {
          console.log('[ScholarService] Some publications were fetched, continuing with partial data');
          hasMore = false;
        } else {
          throw error;
        }
      }
    }

    console.log(`[ScholarService] Total publications fetched: ${publications.length}`);
    return publications.sort((a, b) => b.year - a.year);
  }
}

export const scholarService = new ScholarService();