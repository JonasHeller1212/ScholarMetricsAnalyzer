import { calculateHIndex, calculateH5Index } from '../../citation/h-index';
import type { Publication } from '../../../../types/scholar';

describe('h-index calculations', () => {
  describe('calculateHIndex', () => {
    test('should calculate h-index correctly', () => {
      const citations = [10, 8, 5, 4, 3];
      expect(calculateHIndex(citations)).toBe(4);
    });

    test('should handle empty citations array', () => {
      expect(calculateHIndex([])).toBe(0);
    });

    test('should handle all zeros', () => {
      expect(calculateHIndex([0, 0, 0])).toBe(0);
    });

    test('should handle unsorted citations', () => {
      const citations = [3, 10, 4, 8, 5];
      expect(calculateHIndex(citations)).toBe(4);
    });
  });

  describe('calculateH5Index', () => {
    const currentYear = new Date().getFullYear();
    
    const publications: Publication[] = [
      { title: 'Paper 1', authors: [], venue: '', year: currentYear - 1, citations: 10, url: '' },
      { title: 'Paper 2', authors: [], venue: '', year: currentYear - 2, citations: 8, url: '' },
      { title: 'Paper 3', authors: [], venue: '', year: currentYear - 3, citations: 5, url: '' },
      { title: 'Paper 4', authors: [], venue: '', year: currentYear - 6, citations: 20, url: '' } // Old paper
    ];

    test('should only consider last 5 years', () => {
      expect(calculateH5Index(publications)).toBe(3);
    });

    test('should handle empty publications', () => {
      expect(calculateH5Index([])).toBe(0);
    });
  });
});