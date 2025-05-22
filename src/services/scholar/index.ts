import type { Author } from '../../types/scholar';
import { findJournalRanking } from '../../data/journalRankings';
import { metricsCalculator } from '../metrics';
import { ApiError } from '../../utils/api';

export const scholarService = {
  validateProfileUrl: (url: string) => {
    try {
      // First, check if it's a valid URL
      const urlObj = new URL(url);
      
      // Check if it's a Google Scholar URL (any domain)
      const isGoogleScholar = urlObj.hostname.includes('scholar.google.');
      
      // Check if it has a user parameter
      const hasUserParam = urlObj.searchParams.has('user');
      
      // Check if the user parameter has a valid format
      const userId = urlObj.searchParams.get('user');
      const validUserIdFormat = userId && userId.length >= 12;
      
      // Combine all checks
      const isValid = isGoogleScholar && hasUserParam && validUserIdFormat;
      
      return { 
        isValid, 
        userId: isValid ? userId : null 
      };
    } catch (e) {
      // If URL parsing fails, it's not a valid URL
      console.error('[ScholarService] Invalid URL format:', e);
      return { isValid: false, userId: null };
    }
  },

  fetchProfile: async (profileUrl: string): Promise<Author> => {
    try {
      console.log('[ScholarService] Fetching profile:', profileUrl);
      
      // Normalize the URL to handle different country domains
      const normalizedUrl = normalizeScholarUrl(profileUrl);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || ''}/functions/v1/scholar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
          },
          body: JSON.stringify({ profileUrl: normalizedUrl })
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: `HTTP Error: ${response.status} ${response.statusText}` };
        }
        
        throw new ApiError(
          errorData.error || 'Failed to fetch scholar profile', 
          errorData.code || 'FETCH_ERROR'
        );
      }

      const data = await response.json();
      
      // Validate essential data structure
      if (!data || !data.name) {
        console.error('[ScholarService] Invalid profile data:', data);
        throw new ApiError('Invalid profile data received', 'DATA_ERROR');
      }

      // Ensure metrics exist
      if (!data.metrics) {
        data.metrics = { citationsPerYear: {} };
      }
      
      // Ensure citationsPerYear exists
      if (!data.metrics.citationsPerYear) {
        data.metrics.citationsPerYear = {};
      }

      // Add journal rankings to publications
      const publications = (data.publications || []).map(pub => ({
        ...pub,
        journalRanking: findJournalRanking(pub.venue)
      }));

      // Calculate metrics
      const metrics = metricsCalculator.calculateMetrics(
        publications,
        data.metrics.citationsPerYear,
        data.name
      );

      return {
        name: data.name,
        affiliation: data.affiliation || '',
        imageUrl: data.imageUrl,
        topics: data.topics || [],
        hIndex: data.hIndex || 0,
        totalCitations: data.totalCitations || 0,
        publications,
        metrics
      };
    } catch (error) {
      console.error('[ScholarService] Error fetching profile:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Failed to fetch scholar profile',
        'FETCH_ERROR'
      );
    }
  }
};

/**
 * Normalizes a Google Scholar URL to a standard format
 * Handles different country domains and extracts only the essential user parameter
 */
function normalizeScholarUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Google Scholar URL
    if (!urlObj.hostname.includes('scholar.google.')) {
      throw new Error('Not a Google Scholar URL');
    }
    
    // Extract the user ID
    const userId = urlObj.searchParams.get('user');
    if (!userId) {
      throw new Error('Missing user ID in URL');
    }
    
    // Create a clean normalized URL with just the user parameter
    const normalizedUrl = `https://scholar.google.com/citations?user=${encodeURIComponent(userId)}`;
    
    console.log('[ScholarService] Normalized URL:', normalizedUrl);
    return normalizedUrl;
  } catch (e) {
    console.error('[ScholarService] Error normalizing URL:', e);
    return url; // Return original if normalization fails
  }
}