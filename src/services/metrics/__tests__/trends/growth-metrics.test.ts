import { calculateGrowthRates } from '../../trends/growth-metrics';

describe('growth metrics calculations', () => {
  const currentYear = new Date().getFullYear();
  
  test('should calculate growth rates correctly', () => {
    const citationsPerYear = {
      [currentYear - 3]: 100,
      [currentYear - 2]: 120,
      [currentYear - 1]: 150
    };

    const { yearlyGrowthRates, avgGrowthRate } = calculateGrowthRates(citationsPerYear);

    expect(yearlyGrowthRates[currentYear - 2]).toBeCloseTo(20);
    expect(yearlyGrowthRates[currentYear - 1]).toBeCloseTo(25);
    expect(avgGrowthRate).toBeCloseTo(22.5);
  });

  test('should handle declining citations', () => {
    const citationsPerYear = {
      [currentYear - 3]: 200,
      [currentYear - 2]: 180,
      [currentYear - 1]: 170
    };

    const { yearlyGrowthRates, avgGrowthRate } = calculateGrowthRates(citationsPerYear);

    expect(yearlyGrowthRates[currentYear - 2]).toBeCloseTo(-10);
    expect(yearlyGrowthRates[currentYear - 1]).toBeCloseTo(-5.56, 1);
    expect(avgGrowthRate).toBeCloseTo(-7.78, 1);
  });

  test('should handle empty data', () => {
    const { yearlyGrowthRates, avgGrowthRate } = calculateGrowthRates({});
    
    expect(Object.keys(yearlyGrowthRates)).toHaveLength(0);
    expect(avgGrowthRate).toBe(0);
  });
});