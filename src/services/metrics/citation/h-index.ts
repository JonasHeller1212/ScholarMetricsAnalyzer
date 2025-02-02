import type { Publication } from '../../../types/scholar';

export function calculateHIndex(citations: number[]): number {
  const sortedCitations = [...citations].sort((a, b) => b - a);
  let hIndex = 0;
  
  for (let i = 0; i < sortedCitations.length; i++) {
    if (sortedCitations[i] >= i + 1) {
      hIndex = i + 1;
    } else {
      break;
    }
  }
  
  return hIndex;
}

export function calculateH5Index(publications: Publication[]): number {
  const currentYear = new Date().getFullYear();
  const recentPubs = publications.filter(pub => pub.year > currentYear - 5);
  const citations = recentPubs.map(p => p.citations).sort((a, b) => b - a);
  
  let h5Index = 0;
  for (let i = 0; i < citations.length; i++) {
    if (citations[i] >= i + 1) h5Index = i + 1;
    else break;
  }
  
  return h5Index;
}