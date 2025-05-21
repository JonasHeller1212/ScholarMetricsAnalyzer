# Scholar Metrics Analyzer Troubleshooting Plan

## 1. Last Known Working Version

### Version Information
- Version: 0.9.15 (from CHANGELOG.md)
- Last Successful Deployment: January 31, 2024
- Package.json Configuration:
```json
{
  "name": "scholar-metrics-extension",
  "private": true,
  "version": "0.9.15",
  "dependencies": {
    "d3": "^7.8.5",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.2"
  }
}
```

### Working Configuration
- CORS Proxy: corsproxy.io
- Rate Limiting: 3 retries with 2000ms delay
- User Agent: Chrome 120.0.0.0
- Successful Response Indicators: 'gsc_prf_in' element present

## 2. Google Scholar API Investigation

### API Response Pattern Analysis
```typescript
// Working Response Structure
{
  name: string;           // #gsc_prf_in
  affiliation: string;    // .gsc_prf_il
  publications: {
    title: string;        // .gsc_a_t a
    authors: string[];    // .gsc_a_t .gs_gray
    venue: string;        // .gsc_a_t .gs_gray:last-child
    year: number;         // .gsc_a_y span
    citations: number;    // .gsc_a_c
  }[];
}
```

### Current Issues
1. Profile Detection Failures
   - Error: "Profile not found" for valid profiles
   - Possible cause: Incomplete DOM structure validation
   - Solution: Enhanced profile validation checks

2. Rate Limiting
   - Error: "unusual traffic" responses
   - Impact: Affects all profile fetches
   - Mitigation: Improved retry strategy with exponential backoff

### API Endpoint Status
- Base URL: https://scholar.google.com/citations
- Required Headers:
  ```typescript
  {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
  ```

## 3. Rollback Steps

### Step 1: Backup Current State
```bash
# Create backup of current version
cp -r src src.backup
cp package.json package.json.backup
cp CHANGELOG.md CHANGELOG.md.backup
```

### Step 2: Restore Working Version
1. Update package.json to version 0.9.15
2. Restore ScholarFetcher implementation:

```typescript
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
```

### Step 3: Verify Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 4: Test API Connectivity
Test Cases:
1. US Profile: https://scholar.google.com/citations?user=NOSPtp8AAAAJ
2. UK Profile: https://scholar.google.co.uk/citations?user=NOSPtp8AAAAJ
3. Non-English Profile: https://scholar.google.de/citations?user=NOSPtp8AAAAJ

## 4. Success Criteria

### Required Functionality
1. Profile Loading
   - [ ] Successfully loads US domain profiles
   - [ ] Successfully loads UK domain profiles
   - [ ] Successfully loads non-English profiles
   - [ ] Handles rate limiting gracefully
   - [ ] Provides clear error messages

2. Data Parsing
   - [ ] Extracts author name
   - [ ] Extracts affiliation
   - [ ] Extracts publication list
   - [ ] Calculates citation metrics
   - [ ] Handles special characters

3. Error Handling
   - [ ] Retries on temporary failures
   - [ ] Reports rate limiting clearly
   - [ ] Handles network errors
   - [ ] Validates response data

### Test Cases

1. Profile Loading
```typescript
const testProfiles = [
  'https://scholar.google.com/citations?user=NOSPtp8AAAAJ',
  'https://scholar.google.co.uk/citations?user=NOSPtp8AAAAJ',
  'https://scholar.google.de/citations?user=NOSPtp8AAAAJ'
];

for (const profile of testProfiles) {
  const result = await scholarService.fetchProfile(profile);
  console.assert(result.name, 'Name should be present');
  console.assert(result.publications.length > 0, 'Should have publications');
}
```

2. Error Handling
```typescript
// Rate limiting test
const rateLimitTest = async () => {
  try {
    for (let i = 0; i < 10; i++) {
      await scholarService.fetchProfile(testProfiles[0]);
    }
  } catch (error) {
    console.assert(error.code === 'RATE_LIMIT', 'Should detect rate limiting');
  }
};

// Invalid profile test
const invalidProfileTest = async () => {
  try {
    await scholarService.fetchProfile('https://scholar.google.com/citations?user=INVALID');
  } catch (error) {
    console.assert(error.code === 'PROFILE_NOT_FOUND', 'Should handle invalid profiles');
  }
};
```

### Metrics for Success
- 95% success rate for profile loading
- < 5% rate limiting errors
- < 1s average response time
- 100% accuracy in data parsing
- Zero unhandled exceptions