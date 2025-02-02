import { ApiError } from '../../utils/api';

export class ScholarFetcher {
  private readonly CORS_PROXY = 'https://corsproxy.io/?';
  private readonly MAX_RETRIES = 3;
  private readonly DELAY_MS = 2000;

  private async fetchWithProxy(url: string): Promise<Response> {
    const proxyUrl = `${this.CORS_PROXY}${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  public async fetch(url: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`[ScholarFetcher] Attempt ${attempt}/${this.MAX_RETRIES}`);
        
        const response = await this.fetchWithProxy(url);
        const text = await response.text();

        // Validate the response
        if (!text || text.length < 100) {
          throw new Error('Empty response received');
        }

        if (text.includes('unusual traffic') || text.includes('please show you')) {
          throw new ApiError('Rate limited by Google Scholar. Please try again in a few minutes.', 'RATE_LIMIT');
        }

        if (text.includes('not found') || text.includes('Error 404')) {
          throw new ApiError('Profile not found. Please check the URL.', 'PROFILE_NOT_FOUND');
        }

        // Check for valid profile content
        if (!text.includes('gsc_prf_in')) {
          throw new Error('Invalid profile page structure');
        }

        return text;

      } catch (error) {
        console.warn(`[ScholarFetcher] Attempt ${attempt} failed:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));

        if (error instanceof ApiError) {
          throw error; // Don't retry on API errors
        }

        if (attempt < this.MAX_RETRIES) {
          const delay = this.DELAY_MS * attempt;
          console.log(`[ScholarFetcher] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new ApiError(
      'Failed to fetch profile data. Please try again.',
      'NETWORK_ERROR'
    );
  }
}

export const scholarFetcher = new ScholarFetcher();