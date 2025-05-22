import { calculateHIndex, calculateH5Index } from './citation/h-index';
import { calculateGIndex } from './citation/g-index';
import { calculateI10Index } from './citation/i10-index';
import { calculateAverageCitations, calculateACC5 } from './citation/impact-metrics';
import { calculateCoAuthorMetrics } from './collaboration/co-author-metrics';
import { calculateGrowthRates } from './trends/growth-metrics';
import { findPeakYear, calculateImpactTrend } from './trends/trend-analysis';
import type { Publication, Metrics, TimeRange } from '../../types/scholar';

class MetricsCalculator {
  public calculateMetrics(
    publications: Publication[], 
    citationsPerYear: Record<string, number>, 
    authorName: string,
    timeRange: TimeRange = 'all'
  ): Metrics {
    if (!publications || publications.length === 0) {
      return this.getEmptyMetrics();
    }

    if (!citationsPerYear || Object.keys(citationsPerYear).length === 0) {
      citationsPerYear = this.extractCitationsPerYear(publications);
    }

    const citations = publications.map(p => p.citations);
    
    // Calculate citation metrics
    const hIndex = calculateHIndex(citations);
    const gIndex = calculateGIndex(citations);
    const i10Index = calculateI10Index(citations);
    const h5Index = calculateH5Index(publications);
    
    // Calculate average citations for the selected time range
    const averages = calculateAverageCitations(
      publications.map(p => ({ year: p.year, citations: p.citations })), 
      timeRange
    );
    
    // Calculate growth and trends for the selected time range
    const { yearlyGrowthRates, avgGrowthRate } = calculateGrowthRates(citationsPerYear, timeRange);
    const peak = findPeakYear(citationsPerYear, timeRange);
    const impactTrend = calculateImpactTrend(citationsPerYear, timeRange);
    
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
      filteredPubs[0] || { citations: 0, title: '', url: '' }
    );

    return {
      hIndex,
      gIndex,
      i10Index,
      h5Index,
      totalPublications: publications.length,
      publicationsPerYear: (publications.length / Math.max(1, Object.keys(citationsPerYear).length)).toFixed(1),
      citationsPerYear,
      acc5: calculateACC5(publications),
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

  // Helper function to extract citations per year when not provided
  private extractCitationsPerYear(publications: Publication[]): Record<string, number> {
    const citationsPerYear: Record<string, number> = {};
    
    publications.forEach(pub => {
      if (pub.year) {
        const year = String(pub.year);
        citationsPerYear[year] = (citationsPerYear[year] || 0) + pub.citations;
      }
    });
    
    return citationsPerYear;
  }
  
  // Return default empty metrics object when no data is available
  private getEmptyMetrics(): Metrics {
    return {
      hIndex: 0,
      gIndex: 0,
      i10Index: 0,
      h5Index: 0,
      totalPublications: 0,
      publicationsPerYear: '0',
      citationsPerYear: {},
      acc5: 0,
      avgCitationsPerYear: 0,
      avgCitationsPerPaper: 0,
      citationGrowthRate: 0,
      yearlyGrowthRates: {},
      impactTrend: 'stable',
      peakCitationYear: 0,
      peakCitations: 0,
      collaborationScore: 0,
      soloAuthorScore: 0,
      averageAuthors: 0,
      totalCoAuthors: 0,
      topCoAuthor: '',
      topCoAuthorPapers: 0,
      topCoAuthorCitations: 0,
      topCoAuthorFirstYear: 0,
      topCoAuthorLastYear: 0,
      topCoAuthorFirstPaper: '',
      topCoAuthorLastPaper: '',
      topPaperCitations: 0,
      topPaperTitle: '',
      topPaperUrl: ''
    };
  }
}

export const metricsCalculator = new MetricsCalculator();