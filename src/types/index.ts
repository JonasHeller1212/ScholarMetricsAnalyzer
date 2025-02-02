// Combine all types into a single file
import type { ReactNode } from 'react';

// Basic types
export interface Topic {
  name: string;
  url: string;
  paperCount: number;
}

export interface JournalRanking {
  absRanking?: '4*' | '4' | '3' | '2' | '1';
  sjrRanking?: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  ft50?: boolean;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citations: number;
  url: string;
  journalRanking?: JournalRanking;
}

export interface Metrics {
  hIndex: number;
  gIndex: number;
  i10Index: number;
  h5Index: number;
  totalPublications: number;
  publicationsPerYear: string;
  citationsPerYear: Record<string, number>;
  acc5: number;
  avgCitationsPerYear: number;
  avgCitationsPerPaper: number;
  citationGrowthRate: number;
  yearlyGrowthRates: Record<number, number>;
  impactTrend: 'increasing' | 'stable' | 'decreasing';
  peakCitationYear: number;
  peakCitations: number;
  collaborationScore: number;
  soloAuthorScore: number;
  averageAuthors: number;
  totalCoAuthors: number;
  topPaperCitations: number;
  topPaperTitle: string;
  topPaperUrl: string;
  topCoAuthor: string;
  topCoAuthorPapers: number;
  topCoAuthorCitations: number;
  topCoAuthorFirstYear: number;
  topCoAuthorLastYear: number;
  topCoAuthorFirstPaper: string;
  topCoAuthorLastPaper: string;
}

export interface Author {
  name: string;
  affiliation: string;
  imageUrl?: string;
  topics: Topic[];
  hIndex: number;
  totalCitations: number;
  publications: Publication[];
  metrics: Metrics;
}

// Service types
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

// Component prop types
export interface MetricDisplayProps {
  value: number;
  label: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ProfileHeaderProps {
  author: Author;
  onRefresh?: () => void;
  className?: string;
}

export interface CitationChartProps {
  citationsPerYear: Record<number, number>;
  className?: string;
}

export interface PublicationsListProps {
  publications: Publication[];
  onSort?: (field: SortField) => void;
  className?: string;
}

// Utility types
export type SortField = 'year' | 'citations' | 'title';
export type SortDirection = 'asc' | 'desc';
export type TimeRange = '5y' | '10y' | 'all';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}