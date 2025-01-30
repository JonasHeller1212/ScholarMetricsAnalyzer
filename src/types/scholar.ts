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
    topCoAuthor?: string;
    topCoAuthorImage?: string;
    topCoAuthorUrl?: string;
    topCoAuthorAffiliation?: string;
    topCoAuthorPapers?: number;
    topCoAuthorFirstYear?: number;
    topCoAuthorLatestPaper?: string;
    topCoAuthorLatestPaperUrl?: string;
    topCoAuthorLatestPaperYear?: number;
  };
}