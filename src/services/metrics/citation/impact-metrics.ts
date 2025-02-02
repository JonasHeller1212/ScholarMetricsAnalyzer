import type { Publication, TimeRange } from '../../../types/scholar';

interface CitationAverages {
  perPaper: number;
  perYear: number;
}

export function calculateAverageCitations(
  publications: { year: number; citations: number }[],
  timeRange: TimeRange = 'all'
): CitationAverages {
  const currentYear = new Date().getFullYear();
  
  // Filter publications based on time range
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

  const totalCitations = filteredPubs.reduce((sum, pub) => sum + pub.citations, 0);
  const years = new Set(filteredPubs.map(pub => pub.year));
  const yearCount = years.size;

  return {
    perPaper: Number((totalCitations / Math.max(1, filteredPubs.length)).toFixed(1)),
    perYear: Number((totalCitations / Math.max(1, yearCount)).toFixed(1))
  };
}