import { scholarFetcher } from './fetcher';
import { scholarParser } from './parser';
import { metricsCalculator } from './metrics';
import type { Author, Publication } from '../../types/scholar';

class ScholarService {
  public validateProfileUrl(url: string): { isValid: boolean; userId?: string } {
    console.log('[ScholarService] Validating URL:', url);
    
    const urlPattern = /^https:\/\/scholar\.google\.com\/citations\?(?:.*&)?user=([\w-]+)/;
    const match = url.match(urlPattern);
    
    if (!match) {
      console.warn('[ScholarService] Invalid URL format');
      return { isValid: false };
    }

    console.log('[ScholarService] Valid URL, userId:', match[1]);
    return {
      isValid: true,
      userId: match[1]
    };
  }

  public async fetchProfile(url: string): Promise<Author> {
    console.log('[ScholarService] Fetching profile:', url);
    
    const { isValid, userId } = this.validateProfileUrl(url);
    if (!isValid || !userId) {
      console.error('[ScholarService] Invalid URL format');
      throw new Error('Invalid Google Scholar URL format. Please enter a valid profile URL.');
    }

    try {
      const profileUrl = `https://scholar.google.com/citations?user=${userId}&hl=en`;
      console.log('[ScholarService] Fetching from URL:', profileUrl);
      
      const html = await scholarFetcher.fetch(profileUrl);
      console.log('[ScholarService] Successfully fetched HTML');
      
      const doc = scholarParser.createDOM(html);
      console.log('[ScholarService] Created DOM');
      
      const name = doc.querySelector('#gsc_prf_in')?.textContent?.trim();
      const affiliation = doc.querySelector('.gsc_prf_il')?.textContent?.trim();
      const imageUrl = doc.querySelector('#gsc_prf_pup-img')?.getAttribute('src');

      console.log('[ScholarService] Basic profile data:', { name, affiliation, imageUrl: !!imageUrl });

      if (!name) {
        console.error('[ScholarService] Could not find profile name');
        throw new Error('Could not find profile data. Please check the URL and try again.');
      }

      const topics = Array.from(doc.querySelectorAll('#gsc_prf_int a')).map(el => ({
        name: el.textContent?.trim() || '',
        url: 'https://scholar.google.com' + (el.getAttribute('href') || ''),
        paperCount: parseInt(el.nextElementSibling?.textContent?.replace(/[()]/g, '') || '0', 10)
      }));

      console.log('[ScholarService] Found topics:', topics.length);

      // Get total publication count
      const totalPubsText = doc.querySelector('#gsc_a_nn')?.textContent;
      const totalPubs = totalPubsText ? parseInt(totalPubsText.match(/\d+/)?.[0] || '0', 10) : 0;
      console.log('[ScholarService] Total publications count:', totalPubs);

      const publications = await this.fetchPublications(userId, totalPubs);
      console.log('[ScholarService] Fetched publications:', publications.length);
      
      const citations = publications.map(p => p.citations);
      const hIndex = metricsCalculator.calculateHIndex(citations);
      console.log('[ScholarService] Calculated h-index:', hIndex);

      const citationsPerYear: Record<string, number> = {};
      const yearLabels = Array.from(doc.querySelectorAll('.gsc_g_t')).map(el => parseInt(el.textContent || '0', 10));
      const citationBars = Array.from(doc.querySelectorAll('.gsc_g_a')).map(el => parseInt(el.textContent || '0', 10));
      yearLabels.forEach((year, i) => citationsPerYear[year] = citationBars[i]);

      console.log('[ScholarService] Citations per year:', Object.keys(citationsPerYear).length);

      const metrics = metricsCalculator.calculateMetrics(publications, citationsPerYear, name);
      console.log('[ScholarService] Calculated metrics');

      const author: Author = {
        name,
        affiliation: affiliation || 'Unknown Affiliation',
        imageUrl,
        topics,
        hIndex,
        totalCitations: citations.reduce((sum, c) => sum + c, 0),
        publications,
        metrics
      };

      console.log('[ScholarService] Successfully built author profile');
      return author;
    } catch (error) {
      console.error('[ScholarService] Error fetching scholar profile:', error);
      throw error;
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
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay between requests
        }

        // Critical: Add view_op=list_works parameter to show all publications
        const url = `https://scholar.google.com/citations?user=${userId}&hl=en&cstart=${startIndex}&pagesize=${pageSize}&view_op=list_works`;
        console.log(`[ScholarService] Fetching publications page: ${startIndex / pageSize + 1}`);
        
        const html = await scholarFetcher.fetch(url);
        const newPubs = await scholarParser.parsePublications(html);
        console.log(`[ScholarService] Found ${newPubs.length} publications on this page`);
        
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