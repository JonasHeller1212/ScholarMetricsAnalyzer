export function calculateI10Index(citations: number[]): number {
  return citations.filter(c => c >= 10).length;
}