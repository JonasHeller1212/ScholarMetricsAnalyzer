// Basic types without journal rankings
export interface Topic {
  name: string;
  url: string;
  paperCount: number;
}

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: number;
  citations: number;
  url: string;
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

// Utility types
export type SortField = 'year' | 'citations' | 'title';
export type SortDirection = 'asc' | 'desc';
export type TimeRange = '5y' | '10y' | 'all';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}