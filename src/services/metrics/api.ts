import { findJournalRanking } from '../../data/journalRankings';
import type { JournalMetrics } from './types';

export class JournalMetricsAPI {
  private cache = new Map<string, JournalMetrics>();

  public async getJournalMetrics(journalTitle: string): Promise<JournalMetrics | null> {
    // Check cache first
    if (this.cache.has(journalTitle)) {
      return this.cache.get(journalTitle)!;
    }

    try {
      // Get journal rankings from our static data
      const rankings = findJournalRanking(journalTitle);
      if (!rankings) return null;

      // Cache the results
      this.cache.set(journalTitle, rankings);
      return rankings;
    } catch (error) {
      console.error('Error getting journal metrics:', error);
      return null;
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const journalMetricsAPI = new JournalMetricsAPI();