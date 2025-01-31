export interface JournalRanking {
  jcrQuartile?: 1 | 2 | 3 | 4;  // Q1, Q2, Q3, Q4
  absRanking?: '4*' | '4' | '3' | '2' | '1';  // ABS/AJG ranking
  ft50?: boolean;  // Financial Times Top 50
  scimagoQuartile?: 1 | 2 | 3 | 4;  // Alternative when JCR not available
}

export interface Topic {
  name: string;
  url: string;
  paperCount: number;
}

export interface Publication {
  title: string;
  authors: string[];
  year: number;
  citations: number;
  venue: string;
  url: string;
  journalRanking?: JournalRanking;
}

export interface Author {
  name: string;
  affiliation: string;
  homepage?: string;
  imageUrl?: string;
  topics: Topic[];
  hIndex: number;
  totalCitations: number;
  publications: Publication[];
  metrics: {
    hIndex: number;
    gIndex: number;
    i10Index: number;
    mIndex: number;
    eIndex: number;
    h5Index: number;
    aIndex: number;
    arIndex: number;
    rIndex: number;
    hcIndex: number;
    hiIndex: number;
    totalPublications: number;
    publicationsPerYear: string;
    selfCitationRate: string;
    hpIndex: number;
    sIndex: string;
    rcr: string;
    citationsPerYear: Record<number, number>;
    acc10: number;
    collaborationScore: number;
    soloAuthorScore: number;
    recentPapers: number;
    acc5: number;
    averageAuthors: number;
    totalCoAuthors: number;
    topPaperCitations: number;
    topPaperTitle: string;
    topPaperUrl: string;
  };
}