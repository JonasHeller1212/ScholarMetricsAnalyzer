import type { Author, Publication, Topic, Metrics } from '../../types/scholar';

export interface ScholarService {
  fetchProfile(url: string): Promise<Author>;
  fetchPublications(userId: string): Promise<Publication[]>;
  validateProfileUrl(url: string): { isValid: boolean; userId?: string };
}

export interface MetricsCalculator {
  calculateMetrics(publications: Publication[], citationsPerYear: Record<string, number>, authorName: string): Metrics;
  calculateHIndex(citations: number[]): number;
  calculateGIndex(citations: number[]): number;
  calculateH5Index(publications: Publication[]): number;
}

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  delay?: number;
}