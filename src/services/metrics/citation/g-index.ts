export function calculateGIndex(citations: number[]): number {
  const sortedCitations = [...citations].sort((a, b) => b - a);
  const cumulativeCitations = sortedCitations.reduce((acc, curr, i) => {
    acc[i] = (acc[i - 1] || 0) + curr;
    return acc;
  }, [] as number[]);
  
  let gIndex = 0;
  for (let i = 0; i < cumulativeCitations.length; i++) {
    if (cumulativeCitations[i] >= Math.pow(i + 1, 2)) {
      gIndex = i + 1;
    } else {
      break;
    }
  }
  
  return gIndex;
}