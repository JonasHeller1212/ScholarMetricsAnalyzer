import { openAlexService } from '../openalex';
import { crossrefService } from '../crossref';
import { scholarCache } from '../scholar/cache';
import type { JournalRanking } from '../../types/scholar';
import { JOURNAL_RANKINGS } from '../../data/journalRankings';

export class JournalService {
  private readonly CACHE_PREFIX = 'journal:';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  public async getJournalRanking(venue: string): Promise<JournalRanking | undefined> {
    if (!venue) return undefined;

    // Check cache first
    const cacheKey = `${this.CACHE_PREFIX}${venue.toLowerCase()}`;
    const cached = scholarCache.get<JournalRanking>(cacheKey);
    if (cached) return cached;

    try {
      // First check hardcoded FT50 and other rankings
      const hardcodedRanking = this.findHardcodedRanking(venue);
      if (hardcodedRanking) {
        scholarCache.set(cacheKey, hardcodedRanking);
        return hardcodedRanking;
      }

      // Try to get DOI from venue string
      const doi = this.extractDOI(venue);
      if (doi) {
        // Get metadata from Crossref
        const crossrefData = await crossrefService.getJournalMetadata(doi);
        if (crossrefData?.issn) {
          // Get metrics from OpenAlex using ISSN
          const openAlexData = await openAlexService.getJournalMetrics(crossrefData.issn);
          if (openAlexData) {
            scholarCache.set(cacheKey, openAlexData);
            return openAlexData;
          }
        }
      }

      // If no DOI found, try direct OpenAlex search
      const normalizedVenue = this.normalizeVenueName(venue);
      const openAlexData = await openAlexService.searchJournal(normalizedVenue);
      if (openAlexData) {
        scholarCache.set(cacheKey, openAlexData);
        return openAlexData;
      }

      return undefined;
    } catch (error) {
      console.error('[JournalService] Error getting journal ranking:', error);
      return undefined;
    }
  }

  private findHardcodedRanking(venue: string): JournalRanking | undefined {
    const normalizedVenue = this.normalizeVenueName(venue);
    
    // Check exact match first
    if (JOURNAL_RANKINGS[normalizedVenue]) {
      return JOURNAL_RANKINGS[normalizedVenue];
    }

    // Try partial matches
    for (const [journal, ranking] of Object.entries(JOURNAL_RANKINGS)) {
      if (this.isSubstantialMatch(normalizedVenue, journal)) {
        return ranking;
      }
    }

    return undefined;
  }

  private normalizeVenueName(venue: string): string {
    return venue.toLowerCase()
      .replace(/,.*$/, '') // Remove everything after first comma
      .replace(/\s+\d+.*$/, '') // Remove volume/issue numbers
      .replace(/\([^)]*\)/g, '') // Remove parenthetical content
      .replace(/proceedings.*$/i, '') // Remove proceedings text
      .replace(/conference.*$/i, '') // Remove conference text
      .trim()
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/[.,;:\-]/g, '') // Remove punctuation
      .replace(/&/g, 'and')
      .replace(/^the\s+/, '');
  }

  private isSubstantialMatch(venue: string, journal: string): boolean {
    const shortestLength = Math.min(venue.length, journal.length);
    const matchThreshold = Math.floor(shortestLength * 0.8);
    
    // Check if one string contains most of the other
    if (venue.includes(journal) || journal.includes(venue)) {
      const commonChars = venue.split('').filter(char => journal.includes(char)).length;
      if (commonChars >= matchThreshold) return true;
    }
    
    // Check word-by-word matching
    const venueWords = venue.split(' ');
    const journalWords = journal.split(' ');
    const commonWords = venueWords.filter(word => journalWords.includes(word));
    return commonWords.length >= Math.min(venueWords.length, journalWords.length) * 0.8;
  }

  private extractDOI(venue: string): string | undefined {
    const doiMatch = venue.match(/10\.\d{4,}\/[-._;()\/:A-Z0-9]+/i);
    return doiMatch?.[0];
  }
}

export const journalService = new JournalService();