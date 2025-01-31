// Journal rankings data
export const JOURNAL_RANKINGS = {
  // Top journals with multiple rankings
  'nature': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*' },
  'science': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*' },
  'cell': { jcrQuartile: 1, scimagoQuartile: 1 },
  'lancet': { jcrQuartile: 1, scimagoQuartile: 1 },
  
  // Business/Management journals
  'academy of management journal': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'academy of management review': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'administrative science quarterly': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'journal of management': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4', ft50: true },
  'strategic management journal': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'management science': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'organization science': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  'journal of international business studies': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4*', ft50: true },
  
  // Computer Science journals
  'acm computing surveys': { jcrQuartile: 1, scimagoQuartile: 1, absRanking: '4' },
  'ieee transactions on pattern analysis': { jcrQuartile: 1, scimagoQuartile: 1 },
  'nature machine intelligence': { jcrQuartile: 1, scimagoQuartile: 1 },
  'journal of machine learning research': { jcrQuartile: 1, scimagoQuartile: 1 },
  'artificial intelligence': { jcrQuartile: 1, scimagoQuartile: 1 },
  'ieee transactions': { jcrQuartile: 1, scimagoQuartile: 1 },
  'acm transactions': { jcrQuartile: 1, scimagoQuartile: 1 },
  
  // Publisher-based rankings
  'ieee': { jcrQuartile: 2, scimagoQuartile: 2 },
  'acm': { jcrQuartile: 2, scimagoQuartile: 2 },
  'elsevier': { jcrQuartile: 2, scimagoQuartile: 2 },
  'springer': { jcrQuartile: 2, scimagoQuartile: 2 },
  'wiley': { jcrQuartile: 2, scimagoQuartile: 2 }
} as const;

// Helper function to find matching journal
export function findJournalRanking(venue: string) {
  const normalizedVenue = venue.toLowerCase().trim();
  
  // Direct match
  for (const [journal, ranking] of Object.entries(JOURNAL_RANKINGS)) {
    if (normalizedVenue.includes(journal)) {
      return ranking;
    }
  }
  
  // Publisher-based fallback
  for (const [publisher, ranking] of Object.entries(JOURNAL_RANKINGS)) {
    if (normalizedVenue.includes(publisher)) {
      return ranking;
    }
  }
  
  return undefined;
}