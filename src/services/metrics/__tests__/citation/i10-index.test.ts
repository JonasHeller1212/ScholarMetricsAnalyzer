import { calculateI10Index } from '../../citation/i10-index';

describe('i10-index calculations', () => {
  test('should count papers with 10 or more citations', () => {
    const citations = [15, 12, 10, 8, 5];
    expect(calculateI10Index(citations)).toBe(3);
  });

  test('should handle empty citations array', () => {
    expect(calculateI10Index([])).toBe(0);
  });

  test('should handle all citations below 10', () => {
    expect(calculateI10Index([9, 8, 7, 6])).toBe(0);
  });

  test('should handle all citations above 10', () => {
    expect(calculateI10Index([11, 12, 13])).toBe(3);
  });

  test('should handle exactly 10 citations', () => {
    expect(calculateI10Index([10, 10, 9])).toBe(2);
  });
});