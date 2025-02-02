import type { TimeRange } from '../../../types/scholar';

export function findPeakYear(
  citationsPerYear: Record<string, number>,
  timeRange: TimeRange = 'all'
): {
  year: number;
  citations: number;
} {
  const currentYear = new Date().getFullYear();
  
  // Filter years based on time range
  const years = Object.keys(citationsPerYear)
    .map(Number)
    .filter(year => {
      switch (timeRange) {
        case '5y':
          return year > currentYear - 5;
        case '10y':
          return year > currentYear - 10;
        default:
          return true;
      }
    });

  const peakYear = years.reduce((max, year) => 
    (citationsPerYear[year] > (citationsPerYear[max] || 0)) ? year : max, 
    years[0]
  );

  return {
    year: peakYear,
    citations: citationsPerYear[peakYear] || 0
  };
}