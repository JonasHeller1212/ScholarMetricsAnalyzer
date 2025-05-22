import type { Publication, TimeRange } from '../../../types/scholar';

interface CitationAverages {
  perPaper: number;
  perYear: number;
}

export function calculateAverageCitations(
  publications: { year: number; citations: number }[],
  timeRange: TimeRange = 'all'
): CitationAverages {
  if (!publications || publications.length === 0) {
    return { perPaper: 0, perYear: 0 };
  }
  
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

  if (filteredPubs.length === 0) {
    return { perPaper: 0, perYear: 0 };
  }

  const totalCitations = filteredPubs.reduce((sum, pub) => sum + pub.citations, 0);
  const years = new Set(filteredPubs.map(pub => pub.year));
  const yearCount = Math.max(1, years.size);

  return {
    perPaper: Number((totalCitations / Math.max(1, filteredPubs.length)).toFixed(1)),
    perYear: Number((totalCitations / yearCount).toFixed(1))
  };
}

export function calculateACC5(publications: Publication[]): number {
  if (!publications || publications.length === 0) {
    return 0;
  }
  
  const currentYear = new Date().getFullYear();
  const recentPubs = publications.filter(pub => pub.year > currentYear - 5);
  return recentPubs.reduce((sum, pub) => sum + pub.citations, 0);
}