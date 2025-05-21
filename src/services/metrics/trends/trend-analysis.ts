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

export function calculateImpactTrend(
  citationsPerYear: Record<string, number>,
  timeRange: TimeRange = 'all'
): number {
  const currentYear = new Date().getFullYear();

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
    })
    .sort((a, b) => a - b);

  if (years.length < 2) {
    return 0;
  }

  const n = years.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const year of years) {
    const x = year;
    const y = citationsPerYear[year] || 0;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? numerator / denominator : 0;

  return Number(slope.toFixed(2));
}