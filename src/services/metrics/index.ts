import { calculateHIndex, calculateH5Index } from './citation/h-index';
import { calculateGIndex } from './citation/g-index';
import { calculateI10Index } from './citation/i10-index';
import { calculateACC5, calculateAverageCitations } from './citation/impact-metrics';
import { calculateCoAuthorMetrics } from './collaboration/co-author-metrics';
import { calculateGrowthRates } from './trends/growth-metrics';
import { calculateImpactTrend, findPeakYear } from './trends/trend-analysis';
import type { Publication, Metrics, TimeRange } from '../../types/scholar';

export class MetricsCalculator {
  public calculateMetrics(
    publications: Publication[], 
    citationsPerYear: Record<string, number>, 
    authorName: string,
    timeRange: TimeRange = 'all'
  ): Metrics {
    const citations = publications.map(p => p.citations);
    
    // Calculate citation metrics
    const hIndex = calculateHIndex(citations);
    const gIndex = calculateGIndex(citations);
    const i10Index = calculateI10Index(citations);
    const h5Index = calculateH5Index(publications);
    const acc5 = calculateACC5(publications);
    
    // Calculate average citations for the selected time range
    const averages = calculateAverageCitations(publications, timeRange);
    
    // Calculate growth and trends for the selected time range
    const { yearlyGrowthRates, avgGrowthRate } = calculateGrowthRates(citationsPerYear, timeRange);
    const impactTrend = calculateImpactTrend(citationsPerYear, timeRange);
    const peak = findPeakYear(citationsPerYear, timeRange);
    
    // Calculate collaboration metrics
    const coAuthorStats = calculateCoAuthorMetrics(publications, authorName);
    
    // Find most cited paper within the time range
    const currentYear = new Date().getFullYear();
    const filteredPubs = publications.filter(pub => {
      switch (timeRange) {
        case '5y':
          return pub.year > currentYear - 5;
        case '10y':
          return pub.year > currentYear - 10;
        default:
          return true;
      }
    });
    
    const mostCitedPaper = filteredPubs.reduce((max, current) => 
      current.citations > max.citations ? current : max, 
      filteredPubs[0]
    );

    return {
      hIndex,
      gIndex,
      i10Index,
      h5Index,
      totalPublications: publications.length,
      publicationsPerYear: (publications.length / Math.max(1, Object.keys(citationsPerYear).length)).toFixed(1),
      citationsPerYear,
      acc5,
      avgCitationsPerYear: averages.perYear,
      avgCitationsPerPaper: averages.perPaper,
      citationGrowthRate: avgGrowthRate,
      yearlyGrowthRates,
      impactTrend,
      peakCitationYear: peak.year,
      peakCitations: peak.citations,
      ...coAuthorStats,
      topPaperCitations: mostCitedPaper?.citations || 0,
      topPaperTitle: mostCitedPaper?.title || '',
      topPaperUrl: mostCitedPaper?.url || ''
    };
  }
}