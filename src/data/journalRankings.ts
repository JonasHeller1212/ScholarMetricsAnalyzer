// ABS (Association of Business Schools), FT50, and SJR (Scimago Journal Rank) Rankings
export const JOURNAL_RANKINGS: Record<string, { absRanking?: '4*' | '4' | '3' | '2' | '1', sjrRanking?: 'Q1' | 'Q2' | 'Q3' | 'Q4', ft50?: boolean }> = {
  // FT50 & Top Marketing Journals
  'journal of marketing': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of marketing research': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'marketing science': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of consumer research': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of the academy of marketing science': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'journal of retailing': { absRanking: '4', sjrRanking: 'Q1' },
  'journal of service research': { absRanking: '4', sjrRanking: 'Q1' },
  'industrial marketing management': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of business research': { absRanking: '3', sjrRanking: 'Q1' },
  'european journal of marketing': { absRanking: '3', sjrRanking: 'Q1' },
  'psychology & marketing': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of advertising': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of advertising research': { absRanking: '3', sjrRanking: 'Q1' },
  'marketing letters': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of interactive marketing': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of research in interactive marketing': { absRanking: '2', sjrRanking: 'Q1' },
  'journal of marketing management': { absRanking: '3', sjrRanking: 'Q1' },
  'marketing theory': { absRanking: '3', sjrRanking: 'Q1' },
  
  // FT50 Management & Strategy Journals
  'academy of management journal': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'academy of management review': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'administrative science quarterly': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of management': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of management studies': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'strategic management journal': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'organization science': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'organization studies': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'organizational behavior and human decision processes': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  
  // FT50 Information Systems Journals
  'mis quarterly': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'information systems research': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of management information systems': { absRanking: '4', sjrRanking: 'Q1' },
  'information & management': { absRanking: '3', sjrRanking: 'Q1' },
  'computers in human behavior': { absRanking: '3', sjrRanking: 'Q1' },
  'decision support systems': { absRanking: '3', sjrRanking: 'Q1' },
  'european journal of information systems': { absRanking: '3', sjrRanking: 'Q1' },
  'information systems journal': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of information technology': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of strategic information systems': { absRanking: '3', sjrRanking: 'Q1' },
  'information systems frontiers': { absRanking: '3', sjrRanking: 'Q1' },
  
  // FT50 Operations & Technology Management
  'journal of operations management': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'manufacturing and service operations management': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'production and operations management': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'operations research': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'management science': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  
  // FT50 Finance & Economics
  'journal of finance': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of financial economics': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'review of financial studies': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of political economy': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'american economic review': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'econometrica': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'review of economic studies': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'quarterly journal of economics': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  
  // FT50 Accounting
  'accounting review': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'accounting organizations and society': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'contemporary accounting research': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  'journal of accounting research': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of accounting and economics': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'review of accounting studies': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  
  // FT50 International Business
  'journal of international business studies': { absRanking: '4*', sjrRanking: 'Q1', ft50: true },
  'journal of world business': { absRanking: '4', sjrRanking: 'Q1', ft50: true },
  
  // Other Notable Business Journals
  'journal of business ethics': { absRanking: '3', sjrRanking: 'Q1', ft50: true },
  'business strategy and the environment': { absRanking: '3', sjrRanking: 'Q1' },
  'journal of business & industrial marketing': { absRanking: '2', sjrRanking: 'Q1' },
  'harvard business review': { absRanking: '3', sjrRanking: 'Q1', ft50: true },
  'mit sloan management review': { absRanking: '3', sjrRanking: 'Q1', ft50: true },
  'california management review': { absRanking: '3', sjrRanking: 'Q1', ft50: true }
};

// Helper function to find matching journal with improved matching logic
export function findJournalRanking(venue: string): { absRanking?: '4*' | '4' | '3' | '2' | '1', sjrRanking?: 'Q1' | 'Q2' | 'Q3' | 'Q4', ft50?: boolean } | undefined {
  if (!venue) return undefined;
  
  // Normalize the venue string
  const normalizedVenue = venue.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')           // Normalize spaces
    .replace(/[.,;:\-()]/g, '')     // Remove punctuation
    .replace(/&/g, 'and')           // Replace & with 'and'
    .replace(/^the\s+/, '')         // Remove leading 'the'
    .replace(/\s*\(.*?\)\s*/g, ''); // Remove parenthetical text

  // Common abbreviations and their full forms
  const abbreviations: Record<string, string> = {
    'j ': 'journal ',
    'jnl ': 'journal ',
    'int ': 'international ',
    'intl ': 'international ',
    'mgmt ': 'management ',
    'mgt ': 'management ',
    'mkt ': 'marketing ',
    'mrkt ': 'marketing ',
    'res ': 'research ',
    'rev ': 'review ',
    'sci ': 'science ',
    'tech ': 'technology ',
    'technol ': 'technology ',
    'bus ': 'business ',
    'econ ': 'economics ',
    'eng ': 'engineering ',
    'sys ': 'systems ',
    'proc ': 'proceedings ',
    'trans ': 'transactions ',
    'inf ': 'information ',
    'info ': 'information ',
    'comp ': 'computer ',
    'comput ': 'computer ',
    'behav ': 'behavior ',
    'behaviour ': 'behavior ',
    'eur ': 'european ',
    'edu ': 'education ',
    'educ ': 'education ',
    'psych ': 'psychology ',
    'psychol ': 'psychology ',
    'hum ': 'human ',
    'org ': 'organization ',
    'org ': 'organizational ',
    'acct ': 'accounting ',
    'acc ': 'accounting ',
    'fin ': 'finance ',
    'financ ': 'financial ',
    'ops ': 'operations ',
    'oper ': 'operations ',
    'prod ': 'production ',
    'serv ': 'service ',
    'mfg ': 'manufacturing ',
    'strat ': 'strategic ',
    'dec ': 'decision ',
  };

  // Expand abbreviations in the venue name
  let expandedVenue = normalizedVenue;
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    expandedVenue = expandedVenue.replace(new RegExp(abbr, 'g'), full);
  });

  // Try exact match first
  for (const [journal, ranking] of Object.entries(JOURNAL_RANKINGS)) {
    const normalizedJournal = journal.toLowerCase()
      .trim()
      .replace(/[.,;:\-()]/g, '')
      .replace(/&/g, 'and')
      .replace(/^the\s+/, '');

    if (expandedVenue === normalizedJournal || normalizedVenue === normalizedJournal) {
      return ranking;
    }
  }

  // Try partial matches if exact match fails
  for (const [journal, ranking] of Object.entries(JOURNAL_RANKINGS)) {
    const normalizedJournal = journal.toLowerCase()
      .trim()
      .replace(/[.,;:\-()]/g, '')
      .replace(/&/g, 'and')
      .replace(/^the\s+/, '');

    // Check if the normalized venue contains the journal name or vice versa
    if (expandedVenue.includes(normalizedJournal) || normalizedJournal.includes(expandedVenue)) {
      return ranking;
    }
  }

  return undefined;
}